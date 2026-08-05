/**
 * @file A tree-sitter grammar for the ASP-Core-2 input language format for ASP (Aswer Set Programming) systems.
 * @author Amadé Nemes <nemesamade@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "aspcore2",

  supertypes: ($) => [$.head, $.term],

  inline: ($) => [$.condition, $.body_literal],

  extras: ($) => [$.line_comment, $.block_comment, /\s/],

  rules: {
    source_file: ($) => repeat($.statement),

    line_comment: (_) => token(choice(/%[^*\n\r][^\n\r]*/, "%")),

      // we do not count nested matching block comment delimiters, as this would
      // require an external scanner, and the official Asp-Core-2
      // grammar doesn't do so either. To see how this could be done,
      // see the clingo tree sitter grammar
    block_comment: (_) => token(seq("%*", /[^*]*\*+([^%*][^*]*\*+)*/, "%")),

    statement: ($) => choice($.integrity_constraint, $.rule, $.weak_constraint),

    integrity_constraint: ($) => seq(":-", field("body", $.body), "."),

    rule: ($) =>
      seq(
        field("head", $.head),
        optional(seq(":-", field("body", $.body))),
        ".",
      ),

    weak_constraint: ($) =>
      seq(
        ":~",
        field("body", $.body),
        ".",
        "[",
        field("weight", $.weight_at_level),
        "]",
      ),

    weight_at_level: ($) =>
      seq(
        field("term", $.term),
        optional(seq("@", field("priority", $.term))),
        ",",
        field("terms", $.terms),
      ),

    head: ($) => choice($.disjunction, $.choice),

    body: ($) => seq($.body_literal, repeat(seq(",", $.body_literal))),

    body_literal: ($) =>
      choice(
        $.naf_literal,
        seq(optional(field("sign", $.naf)), field("atom", $.aggregate)),
      ),

    disjunction: ($) =>
      seq($.classical_atom, repeat(seq("|", $.classical_atom))),

    choice: ($) =>
      seq(
        optional(field("left", $.lower)),
        "{",
        field("elements", $.choice_elements),
        "}",
        optional(field("right", $.upper)),
      ),

    lower: ($) => seq($.term, $.relation),
    upper: ($) => seq($.relation, $.term),

    choice_elements: ($) =>
      seq($.choice_element, repeat(seq(";", $.choice_element))),

    choice_element: ($) =>
      seq(field("literal", $.classical_atom), optional($.condition)),

    aggregate: ($) =>
      seq(
        optional(field("left", $.lower)),
        field("function", $.aggregate_function),
        "{",
        field("elements", $.aggregate_elements),
        "}",
        optional(field("right", $.upper)),
      ),

    aggregate_elements: ($) =>
      seq($.aggregate_element, repeat(seq(";", $.aggregate_element))),

    aggregate_element: ($) =>
      choice($.condition, seq(field("terms", $.terms), optional($.condition))),

    aggregate_function: (_) =>
      token(choice("#sum", "#sum+", "#min", "#max", "#count")),

    condition: ($) => seq(":", optional(field("condition", $.naf_literals))),

    naf_literals: ($) => seq($.naf_literal, repeat(seq(",", $.naf_literal))),

    naf_literal: ($) =>
      choice(
        seq(optional(field("sign", $.naf)), field("atom", $.classical_atom)),
        field("atom", $.builtin_atom),
      ),

    classical_atom: ($) =>
      seq(
        optional(field("sign", "-")),
        field("name", $.identifier),
        optional(seq("(", optional(field("arguments", $.terms)), ")")),
      ),

    builtin_atom: ($) => seq($.term, $.relation, $.term),

    relation: (_) => token(choice(">", "<", ">=", "<=", "=", "!=", "<>")),

    terms: ($) => seq($.term, repeat(seq(",", $.term))),

    term: ($) =>
      choice(
        $.function,
        $.number,
        $.string,
        $.variable,
        $.anonymous_variable,
        $.parenthesized_term,
        $.unary_operation,
        $.binary_operation,
      ),

    function: ($) =>
      seq(
        field("name", $.identifier),
        optional(seq("(", optional(field("arguments", $.terms)), ")")),
      ),

    identifier: (_) => token(/[a-z][A-Za-z0-9_]*/),

    parenthesized_term: ($) => seq("(", $.term, ")"),

    unary_operation: ($) =>
      prec.left(3, seq(field("operator", "-"), field("right", $.term))),

    binary_operation: ($) =>
      choice(
        prec.left(
          1,
          seq(
            field("left", $.term),
            field("operator", "+"),
            field("right", $.term),
          ),
        ),
        prec.left(
          1,
          seq(
            field("left", $.term),
            field("operator", "-"),
            field("right", $.term),
          ),
        ),
        prec.left(
          2,
          seq(
            field("left", $.term),
            field("operator", "*"),
            field("right", $.term),
          ),
        ),
        prec.left(
          2,
          seq(
            field("left", $.term),
            field("operator", "/"),
            field("right", $.term),
          ),
        ),
      ),

    number: (_) => token(/0|[1-9][0-9]*/),

    string: (_) => token(/"([^"]|\\")*"/),

    variable: (_) => token(/[A-Z][A-Za-z0-9_]*/),

    anonymous_variable: (_) => token("_"),

    naf: (_) => token("not"),
  },
});
