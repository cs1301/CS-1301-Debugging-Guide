# example 1:
a = []
print(a[1])

# example 2 (over extending for loop):
a = [1, 2, 3]
for i in range(4):
    print(a[i])

#example 3 (bad index offset):
a = [1, 2, 3]
for i in range(len(a)):
    print(a[i + 1])