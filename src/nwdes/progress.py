"""Progress: one read-only projection of where features stand.

A pure leaf over already parsed handoffs plus the facts the shell gathers from each feature
directory: which role drafts are open, which run records are closed and when the handoff
last changed. It writes nothing and decides nothing; a stage it cannot determine is
``None``, never a guess.
"""

import json
from dataclasses import dataclass
from datetime import UTC, datetime
from types import MappingProxyType

from nwdes.handoff import is_prose_only


SCHEMA = "nwave.hud_state.v1"

# The per-slice stages, in route order.
STAGES = ("design", "oracle", "craft", "review")

# What the shell passes for a run record it could not read.
UNREADABLE = object()

_OUTCOMES = ("accepted", "rejected")
_NO_RUNS = MappingProxyType({})


@dataclass(frozen=True)
class Signal:
    """What the feature directory says about one stage of one slice."""

    published: bool  # the handoff section or the run record for this stage exists
    recording: bool  # a role draft for this stage is open right now
    outcome: str | None = None  # "accepted" or "rejected" from a run record, else None


def stage_state(signal: Signal) -> str | None:
    """The public state of one stage: "done", "recording", "rejected", "pending" or None.

    None means "not determinable from what nwdes recorded", which the HUD shows as a
    dash. It is different from "pending", which claims the stage has not started.
    """
    if signal.recording:
        return "recording"
    if not signal.published:
        return "pending"
    if signal.outcome in (None, "accepted"):
        return "done"
    return "rejected" if signal.outcome == "rejected" else None


def record_outcome(raw) -> str:
    """The outcome a closed run record states; any other content is "unreadable".

    ``raw`` is the record's bytes, or ``UNREADABLE`` when the shell could not read it.
    The "unreadable" result is neither None nor an outcome, so its stage is undeterminable.
    """
    if not isinstance(raw, bytes):
        return "unreadable"
    try:
        record = json.loads(raw.decode("utf-8"))
    except ValueError:
        return "unreadable"
    outcome = record.get("outcome") if isinstance(record, dict) else None
    return outcome if outcome in _OUTCOMES else "unreadable"


def _text(facts, reference):
    return facts.get(reference) if reference is not None else None


def _run(runs, name, drafts):
    """The signal of a stage closed by the run record ``name``; drafts share the name."""
    if runs is None:  # the runs directory is unreadable: only an open draft is known
        return Signal(True, name in drafts, "unreadable")
    raw = runs.get(name)
    return Signal(
        raw is not None,
        name in drafts,
        record_outcome(raw) if raw is not None else None,
    )


def _state(signal):
    return None if signal is None else stage_state(signal)


def _stages(design, slice_id, drafts, runs):
    if drafts is None:  # the drafts directory is unreadable: no stage is determinable
        return {
            "design": None,
            "oracle": "skipped" if is_prose_only(design.get(slice_id)) else None,
            "craft": None,
            "review": None,
        }
    published = slice_id in design
    return {
        "design": _state(Signal(published, "design.json" in drafts and not published)),
        # The oracle is authored (acceptance draft) and then approved (oracle review);
        # a prose-only slice has neither, EXAMINE and the candidate review verify it.
        "oracle": "skipped"
        if is_prose_only(design.get(slice_id))
        else "recording"
        if f"acceptance.{slice_id}.json" in drafts
        else _state(_run(runs, f"review.oracle.{slice_id}.json", drafts)),
        "craft": _state(_run(runs, f"craft.{slice_id}.json", drafts)),
        "review": _state(_run(runs, f"review.slice.{slice_id}.json", drafts)),
    }


def modified_at(timestamp) -> str | None:
    """A POSIX timestamp as an ISO-8601 UTC instant, or None when unknown."""
    if timestamp is None:
        return None
    instant = datetime.fromtimestamp(timestamp, UTC).replace(microsecond=0)
    return instant.isoformat().replace("+00:00", "Z")


def feature(handoff, drafts=frozenset(), runs=_NO_RUNS, modified=None):
    """The HUD state of one feature.

    ``drafts`` is the set of file names under ``.nwdes-drafts`` and ``runs`` maps each
    file name under ``runs`` to its bytes (or ``UNREADABLE``). Either is None when its
    directory exists but cannot be read; an absent directory is an empty one.
    ``modified`` is the handoff's POSIX modification time, or None.
    """
    facts = handoff.facts
    product = handoff.product or {}
    design = (handoff.design or {}).get("slices", {})
    return {
        "id": handoff.scope.id,
        "modified": modified_at(modified),
        "request": _text(facts, handoff.request),
        "value": _text(facts, handoff.work.get("value")),
        "size": handoff.work.get("size"),
        "slices": [
            {
                "id": row["id"],
                "observation": _text(facts, row.get("observation")),
                "stages": _stages(design, row["id"], drafts, runs),
            }
            for row in product.get("slices", ())
        ],
        "candidate": {
            "review": None
            if drafts is None
            else _state(_run(runs, "review.candidate.json", drafts))
        },
    }


def project(features):
    """The HUD document for already projected features, most recently modified first."""
    return {
        "schema": SCHEMA,
        "features": sorted(
            features, key=lambda row: row["modified"] or "", reverse=True
        ),
    }
