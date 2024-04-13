# split final_dataset.txt into 4 temp files

with open("final_dataset.txt", encoding="utf-8") as input_file:
    reader = input_file.readlines()
    op_files = [open(f"final/temp_{i}.txt", "w", encoding="utf-8") for i in range(4)]
    for i, row in enumerate(reader):
        op_files[i % 4].write(row)
    for op_file in op_files:
        op_file.close()
