from app.app import run
import logging
import sys

if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="[%(asctime)s] [%(levelname)s] %(message)s",
        datefmt="%d.%m.%Y] [%H:%M:%S",
        stream=sys.stdout
    )

    run()
