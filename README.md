## Anonymize This: Secure Data Analysis for Law Enforcement

This project tackles the challenge of balancing data privacy with effective crime analysis in law enforcement. It offers a two-part solution:

1. **Real-Time Web Shield:** A web application that leverages Presidio for entity recognition and a fine-tuned Roberta model for anonymizing specific data points (profession, address, etc.) in uploaded documents. Differential privacy protects highly sensitive data like names. Users can further customize anonymized content through dropdowns.

2. **Database Anonymization (Batch Processing):** This tool allows manual selection of columns containing sensitive data. Similar to the web shield, it uses a fine-tuned Roberta model for specific columns and differential privacy for names. We're working on automating column selection and utilizing pre-trained models for efficiency.

This project aims to improve data security for individuals, empower law enforcement with anonymized data for investigations, and foster public trust in data handling practices.
