vendors = [
    ["V001", "Midwest Packaging Co.", "Net 30"],
    ["V002", "Buckeye Janitorial Supply", "Net 15"],
]

for vendor in vendors:
    vendor_id = vendor[0]
    name = vendor[1]
    terms = vendor[2]
    print(vendor_id + "  " + name + "  (" + terms + ")")
