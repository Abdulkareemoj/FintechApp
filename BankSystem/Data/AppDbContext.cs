using Microsoft.EntityFrameworkCore;
using FinTech.Models;
using FinTech.Models.Enums;

namespace FinTech.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Wallet> Wallets { get; set; } = null!;
        public DbSet<Card> Cards { get; set; } = null!;
        public DbSet<Transaction> Transactions { get; set; } = null!;
        public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; } = null!;
        public DbSet<EmailVerificationToken> EmailVerificationTokens { get; set; } = null!;

        public DbSet<MoneyRequest> MoneyRequests { get; set; }
        public DbSet<SupportTicket> SupportTickets { get; set; } = null!;
        public DbSet<SupportMessage> SupportMessages { get; set; } = null!;
        public DbSet<HelpArticle> HelpArticles { get; set; } = null!;
        public DbSet<InboxMessage> InboxMessages { get; set; } = null!;
        public DbSet<Notification> Notifications { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure entity relationships
            modelBuilder.Entity<User>().HasMany(u => u.Wallets).WithOne(w => w.User).HasForeignKey(w => w.UserId);
            modelBuilder.Entity<Wallet>().HasMany(w => w.TransactionsFrom).WithOne(t => t.FromWallet).HasForeignKey(t => t.FromWalletId);
            modelBuilder.Entity<Wallet>().HasMany(w => w.TransactionsTo).WithOne(t => t.ToWallet).HasForeignKey(t => t.ToWalletId);
            modelBuilder.Entity<Card>().HasOne(c => c.Wallet).WithMany().HasForeignKey(c => c.WalletId);
            modelBuilder.Entity<Transaction>().HasOne(t => t.FromWallet).WithMany(w => w.TransactionsFrom).HasForeignKey(t => t.FromWalletId);
            modelBuilder.Entity<Transaction>().HasOne(t => t.ToWallet).WithMany(w => w.TransactionsTo).HasForeignKey(t => t.ToWalletId);
            modelBuilder.Entity<MoneyRequest>(entity =>
            {
                entity.ToTable("money_requests");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("NEWID()");

                entity.Property(e => e.RequesterId).HasColumnName("requester_id").IsRequired();
                entity.Property(e => e.RequesterWalletId).HasColumnName("requester_wallet_id").IsRequired();
                entity.Property(e => e.PayerId).HasColumnName("payer_id").IsRequired();

                entity.Property(e => e.Amount)
                    .HasColumnName("amount")
                    .HasPrecision(19, 4)
                    .IsRequired();

                entity.Property(e => e.Currency).HasColumnName("currency").HasMaxLength(3).IsRequired();
                entity.Property(e => e.Description).HasColumnName("description").HasMaxLength(500);

                entity.Property(e => e.Status)
                    .HasColumnName("status")
                    .HasConversion<string>()
                    .HasMaxLength(20)
                    .HasDefaultValue(Models.Enums.MoneyRequestStatus.Pending);

                entity.Property(e => e.TransactionId).HasColumnName("transaction_id");

                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("SYSUTCDATETIME()");
                entity.Property(e => e.RespondedAt).HasColumnName("responded_at");
                entity.Property(e => e.ExpiresAt).HasColumnName("expires_at").IsRequired();

                // IMPORTANT: Restrict on all FKs - avoids SQL Server's "multiple cascade paths"
                // error since MoneyRequest references Users twice (Requester + Payer).
                entity.HasOne(e => e.Requester)
                    .WithMany()
                    .HasForeignKey(e => e.RequesterId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Payer)
                    .WithMany()
                    .HasForeignKey(e => e.PayerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.RequesterWallet)
                    .WithMany()
                    .HasForeignKey(e => e.RequesterWalletId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Transaction)
                    .WithMany()
                    .HasForeignKey(e => e.TransactionId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.RequesterId).HasDatabaseName("idx_money_requests_requester");
                entity.HasIndex(e => e.PayerId).HasDatabaseName("idx_money_requests_payer");
                entity.HasIndex(e => e.Status).HasDatabaseName("idx_money_requests_status");
            });

            modelBuilder.Entity<SupportTicket>(entity =>
            {
                entity.ToTable("support_tickets");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").HasDefaultValueSql("NEWID()");
                entity.Property(e => e.UserId).HasColumnName("user_id").IsRequired();
                entity.Property(e => e.Category).HasColumnName("category").HasMaxLength(50).IsRequired();
                entity.Property(e => e.Subject).HasColumnName("subject").HasMaxLength(200).IsRequired();
                entity.Property(e => e.Description).HasColumnName("description").HasMaxLength(4000).IsRequired();
                entity.Property(e => e.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(20).HasDefaultValue(Models.Enums.SupportTicketStatus.Open);
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("SYSUTCDATETIME()");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("SYSUTCDATETIME()");

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(e => e.Messages)
                    .WithOne(m => m.Ticket)
                    .HasForeignKey(m => m.TicketId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.UserId).HasDatabaseName("idx_support_tickets_user");
                entity.HasIndex(e => e.Status).HasDatabaseName("idx_support_tickets_status");
            });

            modelBuilder.Entity<SupportMessage>(entity =>
            {
                entity.ToTable("support_messages");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").HasDefaultValueSql("NEWID()");
                entity.Property(e => e.TicketId).HasColumnName("ticket_id").IsRequired();
                entity.Property(e => e.SenderId).HasColumnName("sender_id");
                entity.Property(e => e.IsFromUser).HasColumnName("is_from_user").IsRequired();
                entity.Property(e => e.Body).HasColumnName("body").HasMaxLength(4000).IsRequired();
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("SYSUTCDATETIME()");

                entity.HasOne(e => e.Ticket)
                    .WithMany(t => t.Messages)
                    .HasForeignKey(e => e.TicketId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Sender)
                    .WithMany()
                    .HasForeignKey(e => e.SenderId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.TicketId).HasDatabaseName("idx_support_messages_ticket");
                entity.HasIndex(e => e.CreatedAt).HasDatabaseName("idx_support_messages_created");
            });

            modelBuilder.Entity<HelpArticle>(entity =>
            {
                entity.ToTable("help_articles");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").HasDefaultValueSql("NEWID()");
                entity.Property(e => e.Category).HasColumnName("category").HasMaxLength(50).IsRequired();
                entity.Property(e => e.Question).HasColumnName("question").HasMaxLength(300).IsRequired();
                entity.Property(e => e.Answer).HasColumnName("answer").HasMaxLength(4000).IsRequired();
                entity.Property(e => e.SortOrder).HasColumnName("sort_order").HasDefaultValue(0);
                entity.Property(e => e.IsPublished).HasColumnName("is_published").HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("SYSUTCDATETIME()");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("SYSUTCDATETIME()");

                entity.HasIndex(e => e.IsPublished).HasDatabaseName("idx_help_articles_published");
            });

            modelBuilder.Entity<InboxMessage>(entity =>
            {
                entity.ToTable("inbox_messages");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").HasDefaultValueSql("NEWID()");
                entity.Property(e => e.UserId).HasColumnName("user_id").IsRequired();
                entity.Property(e => e.From).HasColumnName("from_name").HasMaxLength(100).IsRequired();
                entity.Property(e => e.Subject).HasColumnName("subject").HasMaxLength(200).IsRequired();
                entity.Property(e => e.Body).HasColumnName("body").HasMaxLength(4000).IsRequired();
                entity.Property(e => e.Type).HasColumnName("type").HasConversion<string>().HasMaxLength(20).HasDefaultValue(Models.Enums.InboxMessageType.System);
                entity.Property(e => e.IsRead).HasColumnName("is_read").HasDefaultValue(false);
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("SYSUTCDATETIME()");

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.UserId).HasDatabaseName("idx_inbox_messages_user");
                entity.HasIndex(e => e.IsRead).HasDatabaseName("idx_inbox_messages_read");
            });

            modelBuilder.Entity<Notification>(entity =>
            {
                entity.ToTable("notifications");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").HasDefaultValueSql("NEWID()");
                entity.Property(e => e.UserId).HasColumnName("user_id").IsRequired();
                entity.Property(e => e.Title).HasColumnName("title").HasMaxLength(200).IsRequired();
                entity.Property(e => e.Body).HasColumnName("body").HasMaxLength(2000).IsRequired();
                entity.Property(e => e.Type).HasColumnName("type").HasConversion<string>().HasMaxLength(20).HasDefaultValue(Models.Enums.NotificationType.System);
                entity.Property(e => e.IsRead).HasColumnName("is_read").HasDefaultValue(false);
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("SYSUTCDATETIME()");

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.UserId).HasDatabaseName("idx_notifications_user");
                entity.HasIndex(e => e.IsRead).HasDatabaseName("idx_notifications_read");
            });

        }
    }
}
