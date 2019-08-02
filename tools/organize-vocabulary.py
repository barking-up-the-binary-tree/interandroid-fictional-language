#!/usr/bin/env python
from string import Template

az = {}
az["symbiosis"] = "predator/prey,symbiosis,parasitism,mutualism"
az["terrain"] = "plateau,mountain,plain,valley,tundra,oasis,steppe,desert,swamp,forest,marsh,river,hill,canyon,glacier,ocean,openground"
az["*spectrum_colors"] = "colorless:0,infrared:1,red:2,orange:3,yellow:4,green:5,cyan:6,blue:7,violet:8,ultraviolet:9"
az["*elements"] = "element:0, hydrogen:1,helium:2,lithium:3,beryllium:4,boron:5,carbon:6,nitrogen:7,oxygen:8,fluorine:9,neon:10,sodium:11,magnesium:12,aluminium:13,silicon:14,phosphorus:15,sulfur:16,chlorine:17,argon:18,potassium:19,calcium:20,scandium:21,titanium:22,vanadium:23,chromium:24,manganese:25,iron:26,cobalt:27,nickel:28,copper:29,zinc:30,gallium:31,germanium:32,arsenic:33,selenium:34,bromine:35,krypton:36,rubidium:37,strontium:38,yttrium:39,zirconium:40,niobium:41,molybdenum:42,technetium:43,ruthenium:44,rhodium:45,palladium:46,silver:47,cadmium:48,indium:49,tin:50,antimony:51,tellurium:52,iodine:53,xenon:54,caesium:55,barium:56,lanthanum:57,cerium:58,praseodymium:59,neodymium:60,promethium:61,samarium:62,europium:63,gadolinium:64,terbium:65,dysprosium:66,holmium:67,erbium:68,thulium:69,ytterbium:70,lutetium:71,hafnium:72,tantalum:73,tungsten:74,rhenium:75,osmium:76,iridium:77,platinum:78,gold:79,mercury:80,thallium:81,lead:82,bismuth:83,polonium:84,astatine:85,radon:86,francium:87,radium:88,actinium:89,thorium:90,protactinium:91,uranium:92,neptunium:93,plutonium:94,americium:95,curium:96,berkelium:97,californium:98,einsteinium:99"
az["universe"] = "Absolute_Zero,Antimatter,alloy, Atom,Big_Bang,Big_Crunch,Black_Body,Black_Hole,chain_reaction, Dark_Energy,Dark_Matter,Electric_Charge, Electric_Field, Electron, Element, Galaxy, Gas, Ion, Isotope, Life, Light, Matter, Molecule, Multiverse, Neutrino, Neutron, Neutron_Star, Nuclear_Fission, Nuclear_Fusion, Nucleus, Photon, Plasma, Positron, Prokaryotes, Eukaryotes, Proton, Pulsar, Quark, Quasar, Radioactivity, RNA, DNA, Space_Time, Star, Supernova, Universe, White_Hole, Wormhole"
az["physics"] = "acceleration,adhesion, antigravity, amplitude,angle, bending, brittleness,buoyancy, centrifugal_force, centripetal_force, collision, deflection, deformation, density, diffraction, dispersion, displacement, distance, drag, ductility, elasticity, emissivity, energy, entropy, fission, fluid, fluorescence, flux, focus, force, frequency, friction, fusion, gravity, ground, heat, ice_point, impedance, inductance, inertia, kinetic_energy, mass, motion, plasticity, power, pressure, probability, radiation, refraction , rotational speed, scattering, siphon, solubility, sound, speed, stiffness, stress, sublimation, superconductivity, surface_tension, temperature, torque, toughness, trajectory, transducer, vacuum, velocity, viscosity, volume, wave, wavelength, weight, wind, work, "
az["electric"] = "electric charge, electric circuit, electric current, electric field, electric generator, electric motor, electrical conductor, electrical insulator, electrical resistance, electromagnet"
az["chemistry_terms"] = "absorption, abundance, accuracy, acid, alcohol, alloy, catalyst, chain reaction, combustion, compression, compound, concentration, condensation, corrosion, crystal, density, diffusion, dispersion, dissociation, dissolution, distillation, entropy, enzyme, equilibrium, extraction, freezing, indicator, metal, melting, mineral, mixture, oxidation, polarity, rust, salt, solubility, solution, solvent, sublimation, temperature, viscosity, volume, water"
az["*ninths"] = "zero_ninth:0,one_ninth:1,two_ninth:2,three_ninth:3,four_ninth:4,five_ninth:5,six_ninth:6,seven_ninth:7,eight_ninth:8,nine_ninth:9"
az["*pair"] = "none_of_pair:0, first_of_pair:1, second_of_pair:2, all_of_pair:9"
az["*triple"] = "none_of_triple:0, first_of_triple:1, second_of_triple:2, third_of_triple:3, all_of_triple:9"
az["*blending"] = "zero_vs_nine:0, one_vs_eight:1, two_vs_seven:2, three_vs_six:3, four_vs_five:4, five_vs_four:5, six_vs_three:6, seven_vs_two:7, eight_vs_one:8, nine_vs_zero:9"
az["*fineBlending"] = "zero_vs_fifteen:0, one_vs_fourteen:1, two_vs_thirteen:2, three_vs_twelve:3, four_vs_eleven:4, five_vs_ten:5, six_vs_nine:6, seven_vs_eight:7"
az["*booleanAlgebra"] = "false:0, true: 1, and: 2, or: 3, not_and: 4, not_or:5, exclusive_or: 7, not:9"
az["operators"] = "add, substract, multiply, divide, exponentiation, round, invert, modulo, sign_change, square_root, factorial"
az["math_symbols"] = """summation, integral,ellipsis, therefore, because, proportionality,
    , infinity, end_of_proof, approximately_equal, same_order_of_magnitude, 
    , is_defined_as, if_and_only_if, is defined to be, is of smaller order than, 
    , is of greater order than, implies, if_then, is a subset of, is a normal subgroup of,
    , is a superset of, from_to, infers, is derived from, Switch statement, floor, ceiling
    , is a subtype of, without, given, is_parallel_to, size of, this contradicts that, for all, for any, for each, for every,
    , there exists,there exists exactly one, is an element of, is not an element of, contains as an element, does not contain as an element,
    , the probability of, the top element, the bottom element, is perpendicular to, is independent of, is comparable to, the set of all numbers
    , the union of, intersected with, the Cartesian product of, sum over, product over
    """

az["units"] = "area, density, energy, force, length, mass, speed, temperature, torque, volume, pressure, time, Frequency, Angle, data"
az["comparator"] = "equal:0, is greater than, is less than, is less than or equal to,is greater than or equal to, max_of, min_of, is_not_equal, negation:9"
az["trigonometry"] = "pi,cosine,sine,tangent,arccosine, arcsine, arctangent"
az["infinity"] = "infinity,negative_infinity"
az["asType"] = "boolean, natural_number, integer, rational_number, real_number, complex_number"
az["*integer_sequence"] = "even_numbers, odd_numbers, prime_numbers, Fibonacci_numbers, perfect_numbers, irrational_numbers, Algebraic_numbers, Transcendental_numbers, Constructible_numbers, Computable_numbers"
az["irrational_numbers"] = "pi,euler_number,golden_ratio"
az["*figure"] = "Dot:1, line:2, triangle:3, quadrilateral:4, pentagon:5, hexagon:6, heptagon:7, octagon:8"
az["shapeLike"] = "ellipse, polygon, star, crescent, annulus, lens,  spiral"
az["todo12"] = "Perimeter, area"
az["directions"] = "Forward, forward_right, right, backward_right, backward, backward-left, left, forward-left"
az["size"] = "Small, tiny, microscopic, infinitesimal"
az["*colors"] = ["Cream","Acid Yellow","Lemon Yellow","Deep Cadmium","Yellow Ochre","Pale Orange","Orange","Bright Orange","Blood Orange","Rose","Scarlet","Red","Deep Red","Deep Fuschia","Cranberry","Loganberry","Soft Pink","Blush Pink","Pink","Bright Pink","Lavender Pink","Grey Lavender","Pale Lavender","Bright Purple","Purple","Bright Lilac","Royal Purple","Blackberry","Ultramarine","Indigo","Prussian Blue","Electric Blue","Blue","Baby Blue","Iced Blue","Cloud Blue","Pale Blue","Sea Green","Grey Green","Mid Green","Dark Green","Green","Pea Green","Light Green","Yellow Green","Lime Green","Mint","Lincoln Green","Pale Mint","Lichen Green","Brown","Dark Brown","Pale Brown","Pimento","Ginger","Peach","Pale Peach","Light Sand","Ochre","Mid Brown","Dark Terracotta","Mid Terracotta","Brown Earth","Brown Black","Black","Persian Grey","Dove Grey","Petrol Grey","Steel Grey","Mid Grey","White Grey","White"]
az["suffixes"] = "Quality, state, act, place, person, belief, condition, position, capable, food, land, transport"
az["crud"] = "create, update, append, swap, read, set, delete, transform, evolve, upgrade, downgrade, reset, verify, merge, extends, watch, Move, Translate, explain"
az["suffixes2"] = "Few, many, without"
az["list_management"] = "first, last, find, reverse, sort, filter, reject, map, count, sample, shuffle, max, min, mean, sum, pick, omit, repeat, range, add_left, add_right, reduce_from_left, reduce_from_right, member_of, all_satisfies, any_satisfies, append, flatten, is_empty, rest, drop, partition"
az["timeUnit"] = "Now, century, year, month, day, minute, second, milliseconds, microseconds, nanoseconds"
az["player"] = "Play, rewind, fast_forward, pause, reverse, stop, skip_previous, skip_next, repeat_forever, repeat_once, replay"
az["spinner"] = "Increase/decrease, Show/hide, Zoom_in/zoom_out, Private/public, Open/Close, OK/KO"
az["answer"] = "Yes, No, Maybe, Do_not know, Do_not understand"

az["building_type"] ="Silo, Hotel, Skyscraper,Retailing, Supermarket, Warehouse, Restaurant, Dormitory, Apartment, House, Hospital, Archive, School, Library, Museum, Theater, Embassy, Palace, Prison, Factory, Arsenal, Citadel, Castle, Aircraft, Spacecraft, Temple, Airport, Bridge, Canal, Road, Skyway, Tunnel, Stadium, Construction, Park, Playground, Port"

az["nature_type"] ="fish, amphibian, Reptile, Bird, mammal, Arthropod, insect, spider, Mollusc, Echinoderm, Annelid, plant"
az["sensors"] ="sight, Hearing, Taste, Smell, Touch, balance, Temperature_sense, Proprioception, pain, Magnetoception, Sexual stimulation, interoception, Hunger, Chronoception, Agency_sense, Familiarity, Echolocation, Electroreception, Hygroreception, Infrared sensing"
az["tenses"] = "past, present, future, hypothesis"
az["positive_probability"] = "likely, very_likely"
az["negative_probability"] = "rarely, uncertainly,"
az["tense_keyword"] = "not, question"

def asArrayForKey(k):
    value = az[k]
    isString = isinstance(value, basestring)
    if isString:
        return value.split(',')
    else:
        return value

def summarize():
    for k in az:
        items = asArrayForKey(k)
        length = len(items)
        if '*' not in k and length>12:
            print k, length

summarize()

def normalize(text):
    return text.replace(' ', '_').lower()

todoTemplate = Template('$name,todo')

def asEnglishTodo(text):
    return todoTemplate.substitute(name= normalize(text))

def asCSV(key):
    items = asArrayForKey(key)
    results = map(asEnglishTodo, items)
    for i in results:
        print i

#asCSV('terrain')