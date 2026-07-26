def convert_to_cefr(cert_type: str, cert_score_level: str) -> str:
    """
    Converts various local certifications (JLPT, TOEIC, HSK) to CEFR scale.
    """
    cert = cert_type.upper().strip()
    score = str(cert_score_level).upper().replace(' ', '')
    
    if cert == 'JLPT':
        mapping = {'N5': 'A1', 'N4': 'A2', 'N3': 'B1', 'N2': 'B2', 'N1': 'C1'}
        return mapping.get(score, 'A1')
    
    elif cert == 'TOEIC':
        try:
            val = int(score)
            if val < 225: return 'A1'
            if val <= 545: return 'A2'
            if val <= 780: return 'B1'
            if val <= 940: return 'B2'
            return 'C1'
        except ValueError:
            return 'A1'
            
    elif cert == 'HSK':
        if score in ['1', '2', 'HSK1', 'HSK2']: return 'A1'
        if score in ['3', 'HSK3']: return 'A2'
        if score in ['4', 'HSK4']: return 'B1'
        if score in ['5', 'HSK5']: return 'B2'
        if score in ['6', 'HSK6']: return 'C1'
        
    return 'A1'
