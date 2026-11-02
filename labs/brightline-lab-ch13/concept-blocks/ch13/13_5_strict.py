def total_due(amounts):
    total = 0
    for amount in amounts:
        total += amount
    return total

print(total_due([482500, 61875]))
