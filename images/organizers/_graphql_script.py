"""Wrote the graphql query without manually going one-by-one to enter each."""
import os

organizers = [o for o in os.listdir() if o.endswith(".jpg")]
for name in sorted(organizers):
    print(
        f'    {name[:-len(".jpg")]}Org: file(relativePath: {{ eq: "organizers/{name}" }}) {{',
        "  ...OrganizerImage",
        "}",
        sep="\n    ",
    )


organizers = [
    {"name": "Ignacio López-Francos", "organization": "NASA Ames Research Center, KBR"},
    {"name": "Brian Coltin", "organization": "NASA Ames Research Center, KBR"},
    {"name": "Maggie Wang", "organization": "Stanford University"},
    {"name": "Alex Sowell", "organization": "NASA Johnson Space Center"},
    {"name": "Rob Royce", "organization": "NASA Jet Propulsion Lab"},
    {"name": "Kuldeep Rambhai", "organization": "Redwire"},
    {"name": "Marcel Kaufmann", "organization": "NASA Jet Propulsion Lab"},
    {"name": "Ricard Marsal", "organization": "University of Luxembourg"},
    {"name": "Roshan Kalghatgi", "organization": "NASA Ames Research Center, KBR"},
]