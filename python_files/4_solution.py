def make_string(a_list):
    final_string = ""
    for item in a_list:
        final_string += str(item)
    return final_string

print(make_string(["I", "'", "m", " ", "f", "e", "e", "l", "i", "n", "g", " ", 22]))