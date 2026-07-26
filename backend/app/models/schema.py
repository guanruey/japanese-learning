from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime, JSON, Boolean, func
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True)
    created_at = Column(DateTime, server_default=func.now())

class BaseLanguage(Base):
    __tablename__ = 'base_languages'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String, unique=True)
    name = Column(String)

class TargetLanguage(Base):
    __tablename__ = 'target_languages'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String, unique=True)
    name = Column(String)

class Vocabulary(Base):
    __tablename__ = 'vocabulary'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    word = Column(String, nullable=False)
    translation = Column(String)
    target_language_id = Column(String, ForeignKey('target_languages.id'))

class ConversationLog(Base):
    __tablename__ = 'conversation_logs'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey('users.id'))
    context = Column(String)
    created_at = Column(DateTime, server_default=func.now())

class FSRSCard(Base):
    __tablename__ = 'fsrs_cards'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey('users.id'))
    vocab_id = Column(String, ForeignKey('vocabulary.id'))
    stability = Column(Float, default=1.0)
    difficulty = Column(Float, default=5.0)
    last_review = Column(DateTime, server_default=func.now())
    next_review = Column(DateTime, server_default=func.now())
    review_count = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())

class ReviewEvent(Base):
    __tablename__ = 'fsrs_review_events'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    card_id = Column(String, ForeignKey('fsrs_cards.id'))
    event_type = Column(String)
    rating = Column(Integer)
    s_before = Column(Float)
    s_after = Column(Float)
    d_before = Column(Float)
    d_after = Column(Float)
    r_at_review = Column(Float)
    context = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

class UserLanguageProfile(Base):
    __tablename__ = 'user_language_profiles'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey('users.id'))
    base_language = Column(String)
    target_language = Column(String)
    cert_type = Column(String)
    cert_score_level = Column(String)
    perceived_speaking_level = Column(String)
    calibrated_cefr_level = Column(String)
    created_at = Column(DateTime, server_default=func.now())
