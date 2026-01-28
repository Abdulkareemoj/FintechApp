
namespace FinTech.Models.Enums
{
    public enum UserRole
    {
        User,
        Admin,
        Support,
        Merchant
    }

    public enum UserStatus
    {
        Active,
        Suspended,
        Deleted
    }

    public enum WalletStatus
    {
        Active,
        Frozen,
        Closed
    }

    public enum TransactionType
    {
        Transfer,
        Deposit,
        Withdrawal,
        Fee,
        Refund
    }

    public enum TransactionStatus
    {
        Pending,
        Completed,
        Failed,
        Reversed
    }
}
