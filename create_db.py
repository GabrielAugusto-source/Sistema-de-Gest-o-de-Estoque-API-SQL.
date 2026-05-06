from app.database import engine
from app.models import Base

print('Iniciando a contrução do banco de dados')

Base.metadata.create_all(bind=engine)

print('Banco de dados criado com sucesso')