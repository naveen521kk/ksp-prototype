import concurrent.futures

import jinja2 as jinja
import csv

# from tqdm import tqdm
from concurrent.futures import ProcessPoolExecutor
import multiprocessing
import tempfile

month_map = {
    "1": "January",
    "2": "February",
    "3": "March",
    "4": "April",
    "5": "May",
    "6": "June",
    "7": "July",
    "8": "August",
    "9": "September",
    "10": "October",
    "11": "November",
    "12": "December",
}
template = """In {{ District_Name }} district, {{ UnitName }} police station, \
a case was registered on {{ Month }} {{ Year }} against {{ Person_Name }}, \
{%- if age != "0" %} a {{ age }} year old{%- endif %}\
{%- if Caste != "NULL" %}, {{ Caste }} by caste{%- endif %}\
{%- if Profession != "NULL" %}, working as a {{ Profession }}{%- endif %} \
{%- if not ("unknown" in PresentAddress.lower() or "not known" in PresentAddress.lower() or PresentAddress.__len__() < 5) %} and residing at {{ PresentAddress }}, \
{%- if PresentCity != "NULL" %} {{ PresentCity }}, {%- endif %} \
{%- if PresentState != "NULL" %} {{ PresentState }}. {%- endif %} \
{%- endif %} \
The accused is from {{ Nationality_Name }}.{%- if Sex != "NULL" %} The accused \
sex is {{ Sex }}.{%- endif %}"""


# read the csv files in test/ and process them in parallel
def process_file(
    file_path: str,
):
    print("Starting to process", file_path)
    with open(file_path, encoding="utf-8") as input_file:
        with open(
            f"{file_path}.txt",
            "w",
            encoding="utf-8",
        ) as output_file:
            reader = csv.DictReader(input_file)
            for row in reader:
                if "unknown" in row["Person_Name"].lower():
                    continue
                # covert month to word
                row["Month"] = month_map[row["Month"]]
                output_file.write(jinja.Template(template).render(row).lower() + "\n")
    print("Finished processing", file_path)
    return file_path


if __name__ == "__main__":

    num_cpu = multiprocessing.cpu_count()

    with concurrent.futures.ProcessPoolExecutor() as executor:
        futures = [
            executor.submit(process_file, f"test/temp_{i}.csv") for i in range(num_cpu)
        ]
        for future in concurrent.futures.as_completed(futures):
            print(future.result())

    # combine the temp files
    with open("test.txt", "w", encoding="utf-8") as output_file:
        for i in range(num_cpu):
            with open(f"test/temp_{i}.csv.txt", encoding="utf-8") as input_file:
                output_file.write(input_file.read())
