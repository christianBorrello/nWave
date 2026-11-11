"""The HUD state projection and the read-only `nwdes state` verb.

The pure tests build handoffs in memory. The shell tests drive a real nwdes flow
(product closed, slices designed, oracle approved, craft closed) in a temporary git
repository and read its `nwdes state` output; nothing is written by hand.
"""

import json
import os
import shutil
import subprocess
from contextlib import redirect_stderr, redirect_stdout
from io import StringIO
from types import SimpleNamespace

import pytest

from nwdes.progress import (
    SCHEMA,
    UNREADABLE,
    Signal,
    feature,
    modified_at,
    project,
    record_outcome,
    stage_state,
)
from nwdes.shell import cli


# ---------------------------------------------------------------- pure projection


def _handoff(*, slices=("S1",), designed=("S1",), facts=None, request="F1", prose=()):
    return SimpleNamespace(
        scope=SimpleNamespace(id="widget-color"),
        request=request,
        facts=facts if facts is not None else {"F1": "Pick a color", "F2": "Chosen"},
        work={"value": "F2", "size": "M"},
        product={"slices": [{"id": sid, "observation": "F1"} for sid in slices]},
        design={
            "slices": {
                sid: {
                    "targets": [
                        {
                            "path": "docs/guides/c.md" if sid in prose else "src/c.py",
                            "change": "Create",
                        }
                    ]
                }
                for sid in designed
            }
        },
    )


def _record(outcome):
    return json.dumps({"outcome": outcome}).encode()


def _stages(state, slice_id="S1"):
    return next(row for row in state["slices"] if row["id"] == slice_id)["stages"]


@pytest.mark.parametrize(
    ("signal", "expected"),
    (
        (Signal(published=False, recording=False), "pending"),
        (Signal(published=True, recording=True, outcome="accepted"), "recording"),
        (Signal(published=False, recording=True), "recording"),
        (Signal(published=True, recording=False), "done"),
        (Signal(published=True, recording=False, outcome="accepted"), "done"),
        (Signal(published=True, recording=False, outcome="rejected"), "rejected"),
        (Signal(published=True, recording=False, outcome="unreadable"), None),
    ),
)
def test_stage_state_rule(signal, expected):
    assert stage_state(signal) == expected


@pytest.mark.parametrize(
    ("raw", "expected"),
    (
        (_record("accepted"), "accepted"),
        (_record("rejected"), "rejected"),
        (_record("indeterminate"), "unreadable"),
        (b'{"slice": "S1"}', "unreadable"),
        (b"[1, 2]", "unreadable"),
        (b'"accepted"', "unreadable"),
        (b"not json", "unreadable"),
        (b"\xff\xfe", "unreadable"),
        (UNREADABLE, "unreadable"),
    ),
)
def test_record_outcome(raw, expected):
    assert record_outcome(raw) == expected


def test_feature_texts_resolve_from_facts():
    state = feature(_handoff(), modified=0)
    assert {
        key: state[key] for key in ("id", "modified", "request", "value", "size")
    } == {
        "id": "widget-color",
        "modified": "1970-01-01T00:00:00Z",
        "request": "Pick a color",
        "value": "Chosen",
        "size": "M",
    }
    assert state["slices"][0]["observation"] == "Pick a color"


def test_unknown_fact_reference_and_unknown_time_are_null():
    state = feature(_handoff(facts={}, request=None))
    assert state["modified"] is None
    assert state["request"] is None
    assert state["value"] is None
    assert state["slices"][0]["observation"] is None


def test_slice_without_design_is_pending():
    state = feature(_handoff(slices=("S1", "S2"), designed=("S1",)))
    assert _stages(state, "S1")["design"] == "done"
    assert _stages(state, "S2")["design"] == "pending"


def test_open_design_draft_records_only_unpublished_slices():
    state = feature(
        _handoff(slices=("S1", "S2"), designed=("S1",)), frozenset(("design.json",))
    )
    assert _stages(state, "S1")["design"] == "done"
    assert _stages(state, "S2")["design"] == "recording"


def test_handoff_without_design_or_product():
    bare = _handoff()
    bare.design = None
    assert _stages(feature(bare))["design"] == "pending"
    bare.product = None
    assert feature(bare)["slices"] == []


def test_untouched_feature_is_all_pending():
    state = feature(_handoff(designed=()))
    assert _stages(state) == dict.fromkeys(
        ("design", "oracle", "craft", "review"), "pending"
    )
    assert state["candidate"] == {"review": "pending"}


def test_open_drafts_mark_their_stage_recording():
    drafts = frozenset(
        (
            "acceptance.S1.json",
            "craft.S1.json",
            "review.slice.S1.json",
            "review.candidate.json",
        )
    )
    state = feature(_handoff(designed=()), drafts)
    assert _stages(state) == {
        "design": "pending",
        "oracle": "recording",
        "craft": "recording",
        "review": "recording",
    }
    assert state["candidate"] == {"review": "recording"}


def test_oracle_approval_draft_is_recording():
    stages = _stages(feature(_handoff(), frozenset(("review.oracle.S1.json",))))
    assert stages["oracle"] == "recording"


def test_drafts_of_another_slice_do_not_leak():
    assert _stages(feature(_handoff(), frozenset(("craft.S2.json",))))["craft"] == (
        "pending"
    )


def test_prose_only_slice_skips_the_oracle():
    state = feature(_handoff(slices=("S1", "S2"), designed=("S1", "S2"), prose=("S2",)))
    assert _stages(state, "S1")["oracle"] == "pending"
    assert _stages(state, "S2")["oracle"] == "skipped"


def test_run_records_decide_closed_stages():
    runs = {
        "review.oracle.S1.json": _record("accepted"),
        "craft.S1.json": _record("accepted"),
        "review.slice.S1.json": _record("rejected"),
        "review.candidate.json": _record("accepted"),
    }
    state = feature(_handoff(), runs=runs)
    assert _stages(state) == {
        "design": "done",
        "oracle": "done",
        "craft": "done",
        "review": "rejected",
    }
    assert state["candidate"] == {"review": "done"}


def test_unreadable_run_record_is_not_determinable():
    runs = {"craft.S1.json": UNREADABLE, "review.slice.S1.json": b"[]"}
    stages = _stages(feature(_handoff(), runs=runs))
    assert (stages["craft"], stages["review"]) == (None, None)


def test_unreadable_runs_directory_nulls_only_run_stages():
    state = feature(_handoff(), frozenset(("craft.S1.json",)), runs=None)
    assert _stages(state) == {
        "design": "done",
        "oracle": None,
        "craft": "recording",
        "review": None,
    }
    assert state["candidate"] == {"review": None}


def test_unreadable_drafts_directory_nulls_every_stage_but_skipped():
    state = feature(_handoff(prose=("S1",)), drafts=None, runs={})
    assert _stages(state) == {
        "design": None,
        "oracle": "skipped",
        "craft": None,
        "review": None,
    }
    assert state["candidate"] == {"review": None}


def test_document_lists_features_most_recent_first():
    older, newer, unknown = (
        {**feature(_handoff(), modified=moment), "id": name}
        for name, moment in (("old", 10), ("new", 20), ("unknown", None))
    )
    document = project((older, unknown, newer))
    assert document["schema"] == SCHEMA == "nwave.hud_state.v1"
    assert [row["id"] for row in document["features"]] == ["new", "old", "unknown"]
    assert project(()) == {"schema": SCHEMA, "features": []}


def test_modified_at_is_utc_seconds():
    assert modified_at(1.9) == "1970-01-01T00:00:01Z"
    assert modified_at(None) is None


# ---------------------------------------------------------------- shell verb

_GIT_ENV = {
    **os.environ,
    "GIT_CONFIG_GLOBAL": os.devnull,
    "GIT_CONFIG_NOSYSTEM": "1",
    "GIT_AUTHOR_NAME": "t",
    "GIT_AUTHOR_EMAIL": "t@example.invalid",
    "GIT_COMMITTER_NAME": "t",
    "GIT_COMMITTER_EMAIL": "t@example.invalid",
}


def _git(root, *arguments):
    subprocess.run(
        ("git", *arguments), cwd=root, env=_GIT_ENV, check=True, capture_output=True
    )


def _commit(root, message):
    _git(root, "add", "-A")
    _git(root, "commit", "-qm", message)


def _nwdes(root, *argv):
    out, err = StringIO(), StringIO()
    with redirect_stdout(out), redirect_stderr(err):
        code = cli.main(
            [
                *argv,
                "--repo-root",
                str(root),
                "--global-config",
                str(root / "none.json"),
            ]
        )
    return code, out.getvalue(), err.getvalue()


def _flow(root):
    """Run the nwdes route up to a closed craft for S1; S2 is prose-only."""
    steps = (
        ("feature", "new", "--request", "Pick a color", "--size", "M", "--value", "Colored"),
        ("product", "promise", "add", "--kind", "Outcome", "--text", "The color shows"),
        ("product", "promise", "add", "--kind", "Outcome", "--text", "The guide reads"),
        ("product", "slice", "add", "--observation", "Color shows", "--promise", "P1"),
        ("product", "slice", "add", "--observation", "Guide reads", "--promise", "P2"),
        ("product", "scope-in", "add", "--text", "Color picking"),
        ("product", "scope-out", "add", "--text", "Themes"),
        ("product", "decision", "add", "--text", "One color", "--status", "Confirmed"),
        ("product", "journey", "add", "--step", "Pick", "--emotion", "calm"),
        ("product", "close", "--outcome", "accepted", "--diagnostic", "ok"),
        (
            "slice", "set", "--slice", "S1", "--observation", "Color shows",
            "--paradigm", "functional", "--oracle", "tests/test_color.py",
            "--stimulus", "Pick", "--expected", "Shown", "--falsifier", "Hidden",
            "--command", "python3 tests/test_color.py", "--create", "src/color.py",
        ),
        (
            "slice", "set", "--slice", "S2", "--observation", "Guide reads",
            "--create", "docs/guides/colors.md",
        ),
        (
            "acceptance", "row", "add", "--slice", "S1", "--covers", "P1",
            "--stimulus", "Pick", "--expected", "Shown", "--user-result", "sees it",
            "--disposition", "Tested", "--test", "tests/test_color.py",
            "--still-passes-if", "color shown",
        ),
        ("acceptance", "close", "--slice", "S1", "--outcome", "accepted", "--diagnostic", "ok"),
        "commit",
        ("review", "observation", "add", "--subject", "oracle", "--slice", "S1", "--text", "Covers P1"),
        ("review", "close", "--subject", "oracle", "--slice", "S1", "--outcome", "accepted", "--diagnostic", "ok"),
        ("craft", "file", "add", "--slice", "S1", "--path", "src/color.py", "--change", "Created"),
        ("craft", "close", "--slice", "S1", "--outcome", "accepted", "--diagnostic", "green", "--role", "nw-functional-software-crafter"),
    )  # fmt: skip
    for step in steps:
        if step == "commit":
            (root / "tests").mkdir()
            (root / "tests/test_color.py").write_text("print('ok')\n")
            _commit(root, "oracle")
            continue
        code, out, err = _nwdes(root, *step, "--feature", "demo")
        assert code == 0, (step, out, err)


@pytest.fixture(scope="module")
def flown(tmp_path_factory):
    root = tmp_path_factory.mktemp("flow")
    _git(root, "init", "-q")
    (root / "README.md").write_text("x\n")
    _commit(root, "init")
    _flow(root)
    return root


@pytest.fixture
def project_root(flown, tmp_path):
    root = tmp_path / "project"
    shutil.copytree(flown, root)
    return root


def _state(root, *argv):
    code, out, err = _nwdes(root, "state", *argv)
    return code, (json.loads(out) if code == 0 else None), err


def test_real_flow_state(project_root):
    code, document, _ = _state(project_root, "--feature", "demo")
    assert code == 0
    assert document["schema"] == "nwave.hud_state.v1"
    (demo,) = document["features"]
    assert (demo["id"], demo["request"], demo["value"], demo["size"]) == (
        "demo",
        "Pick a color",
        "Colored",
        "M",
    )
    assert demo["modified"].endswith("Z")
    assert [row["stages"] for row in demo["slices"]] == [
        {"design": "done", "oracle": "done", "craft": "done", "review": "pending"},
        {
            "design": "done",
            "oracle": "skipped",
            "craft": "pending",
            "review": "pending",
        },
    ]
    assert demo["candidate"] == {"review": "pending"}


def test_without_feature_lists_every_feature(project_root):
    assert _nwdes(project_root, "feature", "new", "--feature", "later",
                  "--request", "R", "--size", "S", "--value", "V")[0] == 0  # fmt: skip
    newest = project_root / "docs/feature/later/handoff.json"
    os.utime(newest, (4_000_000_000, 4_000_000_000))
    code, document, _ = _state(project_root)
    assert code == 0
    assert [row["id"] for row in document["features"]] == ["later", "demo"]


def test_without_any_feature_the_list_is_empty(tmp_path):
    code, document, _ = _state(tmp_path)
    assert (code, document) == (0, {"schema": "nwave.hud_state.v1", "features": []})


def test_unknown_feature_is_refused(project_root):
    code, _, err = _state(project_root, "--feature", "nope")
    assert code == 2
    assert err.startswith("1. WHAT: FeatureUnknown: nope\nWHY: ")
    assert "\nHOW: " in err


def test_invalid_handoff_is_refused(project_root):
    (project_root / "docs/feature/demo/handoff.json").write_text('{"schema": "x"}')
    code, _, err = _state(project_root, "--feature", "demo")
    assert code == 2
    assert "WHAT: HandoffInvalid" in err


def test_epic_is_refused(project_root):
    code, _, err = _state(project_root, "--epic", "big")
    assert code == 2
    assert "WHAT: PartInvalid: --epic" in err


def test_absent_runs_and_drafts_are_empty(project_root):
    shutil.rmtree(project_root / "docs/feature/demo/runs")
    shutil.rmtree(project_root / "docs/feature/demo/.nwdes-drafts", ignore_errors=True)
    _, document, _ = _state(project_root, "--feature", "demo")
    assert document["features"][0]["slices"][0]["stages"] == {
        "design": "done",
        "oracle": "pending",
        "craft": "pending",
        "review": "pending",
    }


def test_runs_that_is_not_a_directory_is_undeterminable(project_root):
    runs = project_root / "docs/feature/demo/runs"
    shutil.rmtree(runs)
    runs.write_text("not a directory")
    _, document, _ = _state(project_root, "--feature", "demo")
    stages = document["features"][0]["slices"][0]["stages"]
    assert (stages["design"], stages["oracle"], stages["craft"]) == ("done", None, None)


def test_run_record_that_is_not_an_object_is_undeterminable(project_root):
    (project_root / "docs/feature/demo/runs/craft.S1.json").write_text("[1, 2]")
    _, document, _ = _state(project_root, "--feature", "demo")
    assert document["features"][0]["slices"][0]["stages"]["craft"] is None


@pytest.mark.skipif(
    not hasattr(os, "geteuid") or os.geteuid() == 0,
    reason="permission bits do not bind root",
)
@pytest.mark.parametrize("directory", ("runs", ".nwdes-drafts"))
def test_unreadable_directory_is_undeterminable_never_a_traceback(
    project_root, directory
):
    target = project_root / "docs/feature/demo" / directory
    target.mkdir(exist_ok=True)
    target.chmod(0)
    try:
        code, document, err = _state(project_root, "--feature", "demo")
    finally:
        target.chmod(0o755)
    assert (code, err) == (0, "")
    stages = document["features"][0]["slices"][0]["stages"]
    assert stages["craft"] is None
    assert stages["design"] == ("done" if directory == "runs" else None)
