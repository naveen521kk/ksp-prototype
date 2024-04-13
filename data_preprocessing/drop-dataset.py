# randomly drop 50% of the dataset
import random

# with open("final/temp_0.txt", encoding="utf-8") as input_file:
#     reader = input_file.readlines()
#     with open("final/temp_0_dropped.txt", "w", encoding="utf-8") as output_file:
#         for row in reader:
#             if random.random() < 0.5:
#                 output_file.write(row)

# with open("final/temp_1.txt", encoding="utf-8") as input_file:
#     reader = input_file.readlines()
#     with open("final/temp_1_dropped.txt", "w", encoding="utf-8") as output_file:
#         for row in reader:
#             if random.random() < 0.5:
#                 output_file.write(row)

# with open("final/temp_2.txt", encoding="utf-8") as input_file:
#     reader = input_file.readlines()
#     with open("final/temp_2_dropped.txt", "w", encoding="utf-8") as output_file:
#         for row in reader:
#             if random.random() < 0.5:
#                 output_file.write(row)

with open("final/temp_3.txt", encoding="utf-8") as input_file:
    reader = input_file.readlines()
    with open("final/temp_3_dropped.txt", "w", encoding="utf-8") as output_file:
        for row in reader:
            if random.random() < 0.5:
                output_file.write(row)
