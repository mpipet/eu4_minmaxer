import pyparsing as pp
from pyparsing import pyparsing_unicode as ppu
import os
import json


def parse(f):
    EQ, LBRACE, RBRACE = map(pp.Suppress, "={}")
    WEIRD_EQUAL = "?="
    SUPERIOR = ">"
    INFERIOR = "<"

    comment = pp.Suppress("#") + pp.Suppress(pp.restOfLine)

    eu4_date = pp.Regex(r"-?\d{1,4}\.\d{1,2}\.\d{1,2}").set_parse_action(
        lambda x: x[0]
    )  

    # Real: nombre avec décimale (mais pas une date)
    real = pp.Regex(r"[+-]?\d+\.\d+").set_parse_action(lambda x: float(x[0]))

    # Integer
    integer = pp.Regex(r"[+-]?\d+").set_parse_action(lambda x: int(x[0]))

    yes = pp.CaselessKeyword("yes").set_parse_action(pp.replace_with(True))
    no = pp.CaselessKeyword("no").set_parse_action(pp.replace_with(False))
    label = pp.Word(
        ppu.Latin1.alphas + ppu.Latin1.alphanums + "_-.:?"
    ) | pp.QuotedString(quote_char='"')

    
    value = eu4_date | real | integer | yes | no | label
    value.set_name("value")

    obj = pp.Forward()

    statement = label + (EQ | WEIRD_EQUAL | SUPERIOR | INFERIOR) + pp.Group(obj | value)
    statement.set_name("statement")

    object_content = pp.ZeroOrMore(pp.Group(statement | value))
    object_content.set_name("object_content")

    empty_object = pp.Empty().set_parse_action(pp.replace_with([]))
    empty_object.set_name("empty_object")

    obj <<= LBRACE + (object_content | empty_object) + RBRACE
    obj.set_name("obj")

    file = pp.OneOrMore(pp.Group(statement))
    file.ignore(comment)
    file.set_name("file")

    res = file.parse_file(f)
    return res.as_list()


def parse_ast(ast):
    parsed = {}

    for item in ast:
        if type(item) != list:
            return item

        if len(item) == 1 and not isinstance(item[0], list):
            # C'est une valeur simple dans une liste
            return item[0]

        if len(item) == 2:
            key, value = item

            if type(value) == list:
                is_simple_list = all(
                    isinstance(v, list) and len(v) == 1 and not isinstance(v[0], list)
                    for v in value
                )

                if is_simple_list:
                    value = [v[0] for v in value]
                elif len(value) == 0:
                    value = []
                else:
                    value = parse_ast(value)

            if key in parsed:
                if type(parsed[key]) == list:
                    value = parsed[key] + [value]
                else:
                    value = [parsed[key], value]

            parsed[key] = value

        # Key Operator Value case
        if len(item) == 3:
            key, operator, value = item

            if type(value) == list:
                is_simple_list = all(
                    isinstance(v, list) and len(v) == 1 and not isinstance(v[0], list)
                    for v in value
                )

                if is_simple_list:
                    value = [v[0] for v in value]
                elif len(value) == 0:
                    value = []
                else:
                    value = parse_ast(value)

            if key in parsed:
                if operator in parsed[key] and type(parsed[key][operator]) == dict:
                    parsed[key][operator] = [parsed[key][operator], value]
                elif operator in parsed[key] and type(parsed[key][operator]) == list:
                    parsed[key][operator].append(value)
            else:
                parsed[key] = {operator: value}

    return parsed


def parse_eu(file):

    ast = parse(file)
    # print(json.dumps(ast))
    parsed = parse_ast(ast)

    return parsed


def parse_files(base_path, files):

    content = {}
    for file in files:
        f = open(
            os.path.join(base_path, file), "r", encoding="utf-8-sig", errors="replace"
        )

        parsed = parse_eu(f)
        content.update(parsed)

    return content
