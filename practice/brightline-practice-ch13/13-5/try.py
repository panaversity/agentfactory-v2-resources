status = "open"
due = ""
cutoff = "2027-03-05"

if status == "open" and due <= cutoff:
    due = due or "from the terms"
    print("INV-8305 " + due)
