def needs_second_approver(cents: int) -> bool:
    return cents >= 1000000

print(needs_second_approver(1290000))
print(needs_second_approver(1000000))
