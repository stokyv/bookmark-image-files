import sys

def main():
    if len(sys.argv) < 2:
        print("Please provide at least one argument.")
        return

    arg1 = sys.argv[1]
    arg2 = sys.argv[2] if len(sys.argv) > 2 else None

    print(f"Argument 1: {arg1}")
    print(f"Argument 2: {arg2}")

if __name__ == "__main__":
    main()