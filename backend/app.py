import os
import re
import spacy
import uvicorn
import docx
import google.generativeai as genai
from dotenv import load_dotenv

from fastapi import FastAPI, Request, UploadFile, File
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

load_dotenv()
app = FastAPI(root_path=os.environ.get("ROOT_PATH"))
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

@app.get("/")
async def read_root():
    return {"message": "Hello World"}


@app.get("/vocab_thresh_masking")
async def vocab_thresh_masking(text, threshold):
    ner_model = spacy.load("en_core_web_sm")
    doc = ner_model(text)
    word_counts = dict()
    for token in doc:
        word_counts[token.text] = word_counts.get(str(token.text), 0) + 1

    threshold = int(threshold)
    frequent_words = [word for word, count in word_counts.items() if count >= threshold]
    masked_text = []
    pii_locations = []  # List to store (start index, end index, type) tuples
    for i, token in enumerate(doc):
        if str(token.text) in frequent_words:
            masked_text.append(str(token.text))
        else:
            masked_text.append("[MASK]")
            # Potentially masked PII, record location and tentative type (UNKNOWN)
            pii_locations.append((token.idx, token.idx + len(token.text), "UNKNOWN"))
    return " ".join(masked_text), pii_locations


@app.get("/entity_tagger_masking")
async def entity_tagger_masking(text):
    ner_model = spacy.load("en_core_web_sm")
    doc = ner_model(text)
    masked_text = []
    pii_locations = []
    for token in doc:
        if token.ent_type_ == "PERSON":
            masked_text.append("[MASK]")
            pii_locations.append((token.idx, token.idx + len(token.text), "PERSON"))
        elif token.ent_type_ == "LOC":
            masked_text.append("[MASK]")
            pii_locations.append((token.idx, token.idx + len(token.text), "LOCATION"))
        elif token.ent_type_ == "ORG":
            masked_text.append("[MASK]")
            pii_locations.append((token.idx, token.idx + len(token.text), "ORGANIZATION"))
        elif token.ent_type_ == "DATE":
            masked_text.append("[MASK]")
            pii_locations.append((token.idx, token.idx + len(token.text), "DATE"))
        else:
            masked_text.append(token.text)
    return " ".join(masked_text), pii_locations


@app.get("/email_and_phone")
async def identify_email_and_phone(text):
    # use regex to identify emails and phone numbers and mask them
    email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    phone_pattern = r"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b"
    
    # find the location of emails and phone numbers
    pii_locations = []
    for match in re.finditer(email_pattern, text):
        pii_locations.append((match.start(), match.end(), "EMAIL"))
    for match in re.finditer(phone_pattern, text):
        pii_locations.append((match.start(), match.end(), "PHONE NUMBER"))

    # mask the emails and phone numbers
    text = re.sub(email_pattern, "[MASK]", text)
    text = re.sub(phone_pattern, "[MASK]", text)
    return text, pii_locations


@app.get("/anonymize_masked_text")
async def anonymize_masked_text(masked_text):
    prompt = f"The following text contains PII marked with [MASK]: \n```\n{masked_text}\n```\n Please anonymize the PII while preserving the context so that the text can be used for analysis."
    response = model.generate_content(prompt)
    return response.text


@app.post("/parse_doc")
async def parse_doc(file: UploadFile):
    doc = docx.Document(file.file)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return "\n".join(full_text)
