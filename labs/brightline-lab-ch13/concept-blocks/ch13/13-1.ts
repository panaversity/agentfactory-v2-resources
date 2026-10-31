const csv = "vendor_id,vendor_name,terms\nV001,Midwest Packaging Co.,Net 30\nV002,Buckeye Janitorial Supply,Net 15\n";
const lines = csv.trim().split(/\r?\n/).slice(1);
for (const line of lines) {
  const [id, name, terms] = line.split(",");
  console.log(`${id}  ${name}  (${terms})`);
}
