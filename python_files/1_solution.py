def long_function():
	s = ""

	s += chr(int(str(1 << 3) * 2) - 1)

	a = 1
	global range
	for i in range(4):
		b = 5
		for j in range(4):
			b += 5
		a += b
	s += chr(a)

	c = [a - a % 100, None]
	c[len(c) - 1] = [c]
	e = int(c[0]) + (len(c) << 2)
	s += chr(e)

	s += chr(3 * 3 * 3 * 3 + 3 * 3 + 3 // 3 * 3 + 3 + 3)

	s += chr(int(str(len(str(max(range(9))))) * 3))

	True = not True
	num = int("1" * 3)
	while 1 in [a for a in range(10)]:
		num -= 2
		range = lambda x: [2]
	s += chr(num)

	for i in [101, 32, 116, 111, 32, 78, 101, 119, 32, 89, 111, 114, 107]:
		s += chr(i)

	print(s)

long_function()