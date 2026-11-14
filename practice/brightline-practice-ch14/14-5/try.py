from pydantic import BaseModel, Field, ValidationError

class Invoice(BaseModel):
    amount: int = Field(ge=0)

for value in [482500, -23450]:
    try:
        Invoice.model_validate({"amount": value})
        print(value, True)
    except ValidationError:
        print(value, False)
