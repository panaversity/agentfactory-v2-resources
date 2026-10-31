csv = "vendor_id,vendor_name,terms\nV001,Midwest Packaging Co.,Net 30\nV002,Buckeye Janitorial Supply,Net 15\n"
for line in csv.strip().splitlines()[1:]:
    vendor_id, name, terms = line.split(",")
    print(f"{vendor_id}  {name}  ({terms})")
