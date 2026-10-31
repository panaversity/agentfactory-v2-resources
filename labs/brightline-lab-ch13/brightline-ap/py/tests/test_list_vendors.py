from brightline_ap.list_vendors import parse_vendors


def test_parse_vendors_reads_id_name_and_terms():
    csv = "vendor_id,vendor_name,terms\nV001,Midwest Packaging Co.,Net 30\n"
    assert parse_vendors(csv) == [
        {"id": "V001", "name": "Midwest Packaging Co.", "terms": "Net 30"}
    ]


def test_parse_vendors_handles_windows_line_endings():
    csv = (
        "vendor_id,vendor_name,terms\r\n"
        "V001,Midwest Packaging Co.,Net 30\r\n"
        "V002,Buckeye Janitorial Supply,Net 15\r\n"
    )
    assert parse_vendors(csv) == [
        {"id": "V001", "name": "Midwest Packaging Co.", "terms": "Net 30"},
        {"id": "V002", "name": "Buckeye Janitorial Supply", "terms": "Net 15"},
    ]
