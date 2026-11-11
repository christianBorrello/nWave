"""Filesystem effects of the read-only `nwdes state` verb.

Gathers, per feature, the parsed handoff, the open role drafts, the closed run records
and the handoff's modification time, then prints the pure `progress` projection. An
absent directory is an empty one; a directory that exists but cannot be read makes the
stages that depend on it undeterminable, never a traceback.
"""

import json
import sys
from pathlib import Path

from nwdes import handoff, progress
from nwdes.contracts import Built, Defect, Refused, checked
from nwdes.destinations import readable_setting, resolve
from nwdes.shell.filesystem import read_file
from nwdes.shell.ports import Missing, Unreadable


def _entries(directory):
    """Entry names of a directory: empty when absent, None when unreadable."""
    try:
        return frozenset(entry.name for entry in Path(directory).iterdir())
    except FileNotFoundError:
        return frozenset()
    except OSError:
        return None


def _read_utf8(path):
    raw = read_file(path)
    if isinstance(raw, bytes):
        try:
            raw.decode("utf-8")
        except UnicodeError as error:
            return Unreadable(path, str(error))
    return raw


def _tiers(ports, scope):
    scoped = () if scope is None else (scope.kind.lower(),)
    return tuple(
        ports.configuration(kind, scope) for kind in ("global", "repository", *scoped)
    )


def _feature(args, ports, scope, listed):
    """Built(feature state), None for a listed id without handoff, else the failure."""
    resolved = resolve(_tiers(ports, scope), scope)
    if isinstance(resolved, Refused):
        return resolved
    path = Path(args.repo_root) / resolved.value.handoff
    raw = _read_utf8(str(path))
    if isinstance(raw, Missing):
        return (
            None
            if listed
            else checked(
                None,
                (
                    Defect(
                        f"FeatureUnknown: {scope.id}",
                        f"No handoff exists at {path}.",
                        "Pass the --feature of an existing feature, or omit it to list every feature.",
                    ),
                ),
            )
        )
    parsed = handoff.parse(raw) if isinstance(raw, bytes) else raw
    if not isinstance(parsed, Built):
        return (
            parsed
            if isinstance(parsed, Unreadable)
            else checked(
                None,
                tuple(
                    Defect(f"{d.what} ({path})", d.why, d.how) for d in parsed.defects
                ),
            )
        )
    runs_dir = path.parent / "runs"
    names = _entries(runs_dir)
    runs = (
        None
        if names is None
        else {
            name: raw
            if isinstance(raw := read_file(str(runs_dir / name)), bytes)
            else progress.UNREADABLE
            for name in names
            if name.endswith(".json")
        }
    )
    try:
        modified = path.stat().st_mtime
    except OSError:
        modified = None
    drafts_open = _entries(path.parent / ".nwdes-drafts")
    return Built(progress.feature(parsed.value, drafts_open, runs, modified))


def _scopes(args, ports):
    """Built(feature scopes to report), or (defects, unreadable) when they cannot be listed."""
    if args.scope is not None:
        return Built((args.scope,))
    tiers = _tiers(ports, None)
    problems = tuple(d for t in tiers if isinstance(t, Refused) for d in t.defects)
    if problems:
        return problems, ()
    root = Path(args.repo_root) / readable_setting(
        tiers, "nwdes.feature.directory", "docs/feature"
    )
    found = (_entries(root), _entries(Path(args.project_root) / ".nwave/features"))
    if found[0] is None:
        return (), (Unreadable(str(root), "the feature directory cannot be listed"),)
    return Built(
        tuple(
            scope.value
            for name in sorted(found[0] | (found[1] or frozenset()))
            if isinstance(scope := handoff.build_scope("Feature", name), Built)
        )
    )


def emit(args, ports, initial, failure):
    """Print the HUD state document; ``failure(defects, unreadable)`` reports refusals."""
    if initial or args.epic:
        epic = Defect(
            "PartInvalid: --epic",
            "state reads features; an epic has no state of its own.",
            "Pass --feature ID, or omit it to list every feature.",
        )
        return failure((*initial, *((epic,) if args.epic else ())), ())
    scopes = _scopes(args, ports)
    if not isinstance(scopes, Built):
        return failure(*scopes)
    results = tuple(
        _feature(args, ports, scope, not args.feature) for scope in scopes.value
    )
    unreadable = tuple(r for r in results if isinstance(r, Unreadable))
    defects = tuple(d for r in results if isinstance(r, Refused) for d in r.defects)
    if unreadable or defects:
        return failure(defects, unreadable)
    features = tuple(r.value for r in results if isinstance(r, Built))
    sys.stdout.write(json.dumps(progress.project(features), indent=2) + "\n")
    return 0
