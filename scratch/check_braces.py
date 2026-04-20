
import sys

def check_balance(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    stack = []
    line = 1
    col = 1
    
    in_string = False
    string_char = None
    in_comment = False
    comment_type = None # 'single' or 'multi'
    
    for i, char in enumerate(content):
        if char == '\n':
            line += 1
            col = 1
            if in_comment and comment_type == 'single':
                in_comment = False
            continue
        
        if in_comment:
            if comment_type == 'multi' and char == '/' and content[i-1] == '*':
                in_comment = False
            col += 1
            continue
            
        if in_string:
            if char == string_char and content[i-1] != '\\':
                in_string = False
            col += 1
            continue
            
        # Check for start of comment/string
        if char == '/' and i+1 < len(content):
            if content[i+1] == '/':
                in_comment = True
                comment_type = 'single'
                col += 1
                continue
            if content[i+1] == '*':
                in_comment = True
                comment_type = 'multi'
                col += 1
                continue
                
        if char in ['"', "'", '`']:
            in_string = True
            string_char = char
            col += 1
            continue
            
        if char in ['{', '(', '[']:
            stack.append((char, line, col))
        elif char in ['}', ')', ']']:
            if not stack:
                print(f"Extra closing {char} at {line}:{col}")
                return
            opening, o_line, o_col = stack.pop()
            if (opening == '{' and char != '}') or \
               (opening == '(' and char != ')') or \
               (opening == '[' and char != ']'):
                print(f"Mismatched {char} at {line}:{col}. Opened {opening} at {o_line}:{o_col}")
                return
        col += 1
        
    if stack:
        for char, l, c in stack:
            print(f"Unclosed {char} from {l}:{c}")
    else:
        print("Braces/Brackets are balanced!")

if __name__ == "__main__":
    check_balance(sys.argv[1])
