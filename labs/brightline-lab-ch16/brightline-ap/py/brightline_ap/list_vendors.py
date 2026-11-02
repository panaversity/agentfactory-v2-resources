from brightline_ap.data import read_data, records
from brightline_ap.due_date import Terms, parse_terms, terms_days


def vendor_lines(vendors_csv: str) -> list[str]:
    vendors: list[tuple[str, str, Terms]] = [(v["vendor_id"], v["vendor_name"], parse_terms(v["terms"])) for v in records(vendors_csv)]
    vendors.sort(key=lambda v: terms_days(v[2]))
    return [f"{i}  {n}  ({t})" for i, n, t in vendors]


if __name__ == "__main__":
    for line in vendor_lines(read_data("vendors.csv")):
        print(line)
