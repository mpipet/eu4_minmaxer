import pyparsing as pp
import re

def parse_localization(f):
	def remove_color_code(t):
		t[0] = t[0].replace('§Y', '')
		t[0] = t[0].replace('§', '')
	
	# Support both : and =
	SEPARATOR = pp.Suppress(pp.Literal(":") | pp.Literal("="))
	
	label = pp.Word(pp.alphanums + pp.alphas8bit + "_-.?$'")
	integer = pp.Regex(r"[+-]?\d+").set_parse_action(lambda x: int(x[0]))
	
	comment = pp.Suppress("#") + pp.Suppress(pp.restOfLine)
	
	# Quoted value
	START_QUOTE = pp.Suppress(pp.Literal('\"'))
	END_QUOTE = pp.Suppress('"')
	QUOTED = pp.Regex(r"(?<=\").*(?=\")").leave_whitespace().addParseAction(remove_color_code)
	quoted_value = START_QUOTE + QUOTED + END_QUOTE
	
	# Format 1: KEY=NUMBER (no quoted value after)
	# The number here IS the value
	localization_no_quote = (
		pp.Optional(pp.OneOrMore(comment)) + 
		label + 
		SEPARATOR + 
		integer.copy().set_parse_action(lambda x: str(x[0]))  # Keep as string
	) + pp.Optional(comment)
	
	# Format 2: KEY:NUMBER "quoted value" 
	# The number is suppressed, quoted value is kept
	localization_with_quote = (
		pp.Optional(pp.OneOrMore(comment)) + 
		label + 
		SEPARATOR + 
		pp.Suppress(integer) +
		quoted_value
	) + pp.Optional(comment)
	
	# Try with quote first, then without
	localizations = localization_with_quote | localization_no_quote
	
	# Section header (l_english:)
	obj = pp.Suppress(label) + pp.Suppress(":") + pp.Dict(pp.OneOrMore(pp.Group(localizations)))
	
	res = obj.parse_file(f)
	return res.as_dict()


def load_localizations(locale_paths):

	localizations = {}
	for locale_path in locale_paths:
		
		with open(locale_path, "r", encoding='utf-8-sig') as file:
			localization = parse_localization(file)
			localizations.update(localization)

	return localizations

