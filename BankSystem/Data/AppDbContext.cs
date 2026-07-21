using Microsoft.EntityFrameworkCore;
using FinTech.Models;

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
        }
    }
}
