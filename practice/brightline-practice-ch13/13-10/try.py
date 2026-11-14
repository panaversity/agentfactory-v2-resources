pages = [["INV-8301", "INV-8302"], ["INV-8306"], []]
page = 0
while len(pages[page]) > 0:
    print("page", page + 1, "has", len(pages[page]))
    page += 1
print("stopped at page", page + 1)
