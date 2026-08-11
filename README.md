# 🌳 tree-sitter-aspcore2 [![ci-badge]][ci] [![pypi-version-badge]][pypi] [![npm-version-badge]][npm] [![crates-version-badge]][crates] [![rust-doc-badge]][rust-doc]

This repository provides the [tree-sitter] grammar for the ASP-Core-2 input
language format, a standard input language for Answer Set Programming (ASP)
systems.

## 📦 Installation

- **Python:** `pip install tree-sitter-aspcore2` ([PyPI][pypi])
- **Node.js:** `npm install @potassco/tree-sitter-aspcore2` ([npm][npm])
- **Rust:** `cargo add tree-sitter-aspcore2` ([crates.io][crates])
- **C:** Build with `tree-sitter build`

## 📋 Release Checklist

When preparing a new release, ensure the version is updated consistently in the
following files:

- `package.json`
- `package-lock.json` (run `tree-sitter generate` to update)
- `Cargo.toml`
- `Cargo.lock` (run `cargo update` to update)
- `pyproject.toml`
- `Makefile`

[tree-sitter]: https://tree-sitter.github.io/tree-sitter/
[ci-badge]: https://github.com/potassco/tree-sitter-aspcore2/workflows/CI%20test/badge.svg
[ci]: https://github.com/potassco/tree-sitter-aspcore2/actions/workflows/ci-test.yml
[crates-version-badge]: https://img.shields.io/crates/v/tree-sitter-aspcore2.svg
[crates]: https://crates.io/crates/tree-sitter-aspcore2
[rust-doc-badge]: https://img.shields.io/badge/api-rustdoc-blue.svg
[rust-doc]: https://docs.rs/tree-sitter-aspcore2
[pypi-version-badge]: https://img.shields.io/pypi/v/tree-sitter-aspcore2.svg
[pypi]: https://pypi.org/project/tree-sitter-aspcore2/
[npm-version-badge]: https://img.shields.io/npm/v/@potassco/tree-sitter-aspcore2.svg
[npm]: https://www.npmjs.com/package/@potassco/tree-sitter-aspcore2
