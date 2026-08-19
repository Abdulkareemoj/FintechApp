
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

    public enum CardStatus
    {
        Active,
        Frozen,
        Blocked,
        Expired,
        Cancelled
    }

    public enum DepositSource
    {
        BankTransfer,
        DebitCard,
        USSD,
        Other
    }

    public enum MoneyRequestStatus
    {
        Pending,
        Paid,
        Declined,
        Cancelled,
        Expired
    }

    public enum SupportTicketStatus
    {
        Open,
        InProgress,
        Resolved,
        Closed
    }

    public enum InboxMessageType
    {
        System,
        Support,
        Statement,
        Security,
        Promotion
    }

    public enum NotificationType
    {
        Payment,
        Security,
        Card,
        Bill,
        System
    }
}

