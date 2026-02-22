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

        public DbSet<User> Users { get; set; }
        public DbSet<Wallet> Wallets { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
public DbSet<RefreshToken> RefreshTokens { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ===========================
            // USER CONFIGURATION
            // ===========================
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(e => e.Email)
                    .HasColumnName("email")
                    .HasMaxLength(255)
                    .IsRequired();

                entity.Property(e => e.PasswordHash)
                    .HasColumnName("password_hash")
                    .HasMaxLength(255)
                    .IsRequired();

                entity.Property(e => e.FirstName)
                    .HasColumnName("first_name")
                    .HasMaxLength(100);

                entity.Property(e => e.LastName)
                    .HasColumnName("last_name")
                    .HasMaxLength(100);

                entity.Property(e => e.Phone)
                    .HasColumnName("phone")
                    .HasMaxLength(20);

                entity.Property(e => e.Role)
                    .HasColumnName("role")
                    .HasConversion<string>()
                    .HasMaxLength(20)
                    .HasDefaultValue(UserRole.User);

                entity.Property(e => e.Status)
                    .HasColumnName("status")
                    .HasConversion<string>()
                    .HasMaxLength(20)
                    .HasDefaultValue(UserStatus.Active);

                entity.Property(e => e.EmailVerified)
                    .HasColumnName("email_verified")
                    .HasDefaultValue(false);

                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnName("updated_at")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                // Indexes
                entity.HasIndex(e => e.Email)
                    .IsUnique()
                    .HasDatabaseName("idx_users_email");

                entity.HasIndex(e => e.Status)
                    .HasDatabaseName("idx_users_status");
            });

            // ===========================
            // WALLET CONFIGURATION
            // ===========================
            modelBuilder.Entity<Wallet>(entity =>
            {
                entity.ToTable("wallets");
                
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(e => e.UserId)
                    .HasColumnName("user_id")
                    .IsRequired();

                entity.Property(e => e.CurrencyCode)
                    .HasColumnName("currency_code")
                    .HasMaxLength(3)
                    .IsRequired();

                entity.Property(e => e.Status)
                    .HasColumnName("status")
                    .HasConversion<string>()
                    .HasMaxLength(20)
                    .HasDefaultValue(WalletStatus.Active);

                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnName("updated_at")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                // Relationships
                entity.HasOne(e => e.User)
                    .WithMany(u => u.Wallets)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Indexes
                entity.HasIndex(e => e.UserId)
                    .HasDatabaseName("idx_wallets_user_id");

                entity.HasIndex(e => new { e.UserId, e.CurrencyCode })
                    .IsUnique()
                    .HasDatabaseName("idx_wallets_user_currency");

                entity.HasIndex(e => e.Status)
                    .HasDatabaseName("idx_wallets_status");
            });

            // ===========================
            // TRANSACTION CONFIGURATION
            // ===========================
            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.ToTable("transactions");
                
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(e => e.IdempotencyKey)
                    .HasColumnName("idempotency_key")
                    .IsRequired();

                entity.Property(e => e.FromWalletId)
                    .HasColumnName("from_wallet_id");

                entity.Property(e => e.ToWalletId)
                    .HasColumnName("to_wallet_id");

                entity.Property(e => e.Amount)
                    .HasColumnName("amount")
                    .HasPrecision(19, 4)
                    .IsRequired();

                entity.Property(e => e.Currency)
                    .HasColumnName("currency")
                    .HasMaxLength(3)
                    .IsRequired();

                entity.Property(e => e.Type)
                    .HasColumnName("type")
                    .HasConversion<string>()
                    .HasMaxLength(20)
                    .IsRequired();

                entity.Property(e => e.Status)
                    .HasColumnName("status")
                    .HasConversion<string>()
                    .HasMaxLength(20)
                    .HasDefaultValue(TransactionStatus.Pending);

                entity.Property(e => e.Description)
                    .HasColumnName("description")
                    .HasMaxLength(500);

                entity.Property(e => e.Metadata)
                    .HasColumnName("metadata")
                    .HasColumnType("jsonb");

                entity.Property(e => e.ReferenceId)
                    .HasColumnName("reference_id")
                    .HasMaxLength(100);

                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CompletedAt)
                    .HasColumnName("completed_at");

                // Relationships
                entity.HasOne(e => e.FromWallet)
                    .WithMany(w => w.TransactionsFrom)
                    .HasForeignKey(e => e.FromWalletId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.ToWallet)
                    .WithMany(w => w.TransactionsTo)
                    .HasForeignKey(e => e.ToWalletId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Indexes
                entity.HasIndex(e => e.IdempotencyKey)
                    .IsUnique()
                    .HasDatabaseName("idx_transactions_idempotency_key");

                entity.HasIndex(e => new { e.FromWalletId, e.CreatedAt })
                    .HasDatabaseName("idx_transactions_from_wallet");

                entity.HasIndex(e => new { e.ToWalletId, e.CreatedAt })
                    .HasDatabaseName("idx_transactions_to_wallet");

                entity.HasIndex(e => e.Status)
                    .HasDatabaseName("idx_transactions_status");

                entity.HasIndex(e => e.CreatedAt)
                    .HasDatabaseName("idx_transactions_created_at");
            });

               // ===========================
            // REFRESH TOKEN CONFIGURATION
            // ===========================

            modelBuilder.Entity<RefreshToken>(entity =>
{
    entity.ToTable("refresh_tokens");
    
    entity.HasKey(e => e.Id);

    entity.Property(e => e.Id)
        .HasColumnName("id")
        .HasDefaultValueSql("gen_random_uuid()");

    entity.Property(e => e.UserId)
        .HasColumnName("user_id")
        .IsRequired();

    entity.Property(e => e.Token)
        .HasColumnName("token")
        .HasMaxLength(500)
        .IsRequired();

    entity.Property(e => e.ExpiresAt)
        .HasColumnName("expires_at")
        .IsRequired();

    entity.Property(e => e.CreatedAt)
        .HasColumnName("created_at")
        .HasDefaultValueSql("CURRENT_TIMESTAMP");

    entity.Property(e => e.IsRevoked)
        .HasColumnName("is_revoked")
        .HasDefaultValue(false);

    entity.Property(e => e.RevokedAt)
        .HasColumnName("revoked_at");

    entity.Property(e => e.CreatedByIp)
        .HasColumnName("created_by_ip")
        .HasMaxLength(45);

    entity.HasOne(e => e.User)
        .WithMany()
        .HasForeignKey(e => e.UserId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.HasIndex(e => e.Token)
        .IsUnique()
        .HasDatabaseName("idx_refresh_tokens_token");

    entity.HasIndex(e => e.UserId)
        .HasDatabaseName("idx_refresh_tokens_user_id");
});
        }

        // Override SaveChanges to update UpdatedAt automatically
        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.State == EntityState.Modified);

            foreach (var entry in entries)
            {
                if (entry.Entity is User user)
                {
                    user.UpdatedAt = DateTime.UtcNow;
                }
                else if (entry.Entity is Wallet wallet)
                {
                    wallet.UpdatedAt = DateTime.UtcNow;
                }
            }
        }
    }
}
