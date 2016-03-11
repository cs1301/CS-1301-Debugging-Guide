def swap(a, b):
    temp = a
    a = b
    b = temp

value_1 = "less"
value_2 = "Fear"

# does this function call do what we think it does?
# you might want to read up on 'scope' here:
# http://openbookproject.net/thinkcs/python/english3e/modules.html#index-4
swap(value_1, value_2)

print(value_1 + value_2)