def yell(string):
    string[len(string)] = "!"
    return string

print(yell("I've got a blank space"))