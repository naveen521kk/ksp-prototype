import os
import sys
import argparse
from typing import List, Optional, Union

import uvicorn

if __name__ == "__main__":
     uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)