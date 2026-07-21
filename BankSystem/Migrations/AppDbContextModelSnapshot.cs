using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FinTech.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260225132510_AddPasswordResetAndEmailVerification")]
    public partial class AddPasswordResetAndEmailVerification
    {
        /// <inheritdoc />
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityAlwaysColumn(modelBuilder);

            modelBuilder.Entity<FinTech.Models.Card>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("cards");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.CardNumber).HasColumnName("card_number");
                entity.Property(e => e.CardHolderName).HasColumnName("card_holder_name");
                entity.Property(e => e.ExpiryMonth).HasColumnName("expiry_month");
                entity.Property(e => e.ExpiryYear).HasColumnName("expiry_year");
                entity.Property(e => e.CVV).HasColumnName("cvv");
                entity.Property(e => e.LastFourDigits).HasColumnName("last_four_digits");
                entity.Property(e => e.CardType).HasColumnName("card_type");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
                entity.Property(e => e.DailyLimit).HasColumnName("daily_limit");
                entity.Property(e => e.MonthlyLimit).HasColumnName("monthly_limit");
                entity.Property(e => e.SpendingLimit).HasColumnName("spending_limit");
                entity.Property(e => e.Metadata).HasColumnType("jsonb");
            });

            modelBuilder.Entity<FinTech.Models.RefreshToken>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("refresh_tokens");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Token).HasColumnName("token");
                entity.Property(e => e.ExpiresAt).HasColumnName("expires_at");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.IsRevoked).HasColumnName("is_revoked");
                entity.Property(e => e.RevokedAt).HasColumnName("revoked_at");
                entity.Property(e => e.CreatedByIp).HasColumnName("created_by_ip");

                entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId);
            });

            modelBuilder.Entity<FinTech.Models.User>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("users");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
                entity.Property(e => e.FirstName).HasColumnName("first_name");
                entity.Property(e => e.LastName).HasColumnName("last_name");
                entity.Property(e => e.Phone).HasColumnName("phone");
                entity.Property(e => e.Role).HasColumnName("role");
                entity.Property(e => e.Status).HasColumnName("status");
                entity.Property(e => e.EmailVerified).HasColumnName("email_verified");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            });

            modelBuilder.Entity<FinTech.Models.Wallet>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("wallets");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.CurrencyCode).HasColumnName("currency_code");
                entity.Property(e => e.Status).HasColumnName("status");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

                entity.HasOne(e => e.User).WithMany(u => u.Wallets).HasForeignKey(e => e.UserId);
            });

            modelBuilder.Entity<FinTech.Models.Transaction>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("transactions");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.IdempotencyKey).HasColumnName("idempotency_key");
                entity.Property(e => e.FromWalletId).HasColumnName("from_wallet_id");
                entity.Property(e => e.ToWalletId).HasColumnName("to_wallet_id");
                entity.Property(e => e.Amount).HasColumnName("amount");
                entity.Property(e => e.Currency).HasColumnName("currency");
                entity.Property(e => e.Type).HasColumnName("type");
                entity.Property(e => e.Status).HasColumnName("status");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.ReferenceId).HasColumnName("reference_id");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.CompletedAt).HasColumnName("completed_at");
                entity.Property(e => e.Metadata).HasColumnType("jsonb");

                entity.HasOne(e => e.FromWallet).WithMany(w => w.TransactionsFrom).HasForeignKey(e => e.FromWalletId);
                entity.HasOne(e => e.ToWallet).WithMany(w => w.TransactionsTo).HasForeignKey(e => e.ToWalletId);
            });

            modelBuilder.Entity<FinTech.Models.PasswordResetToken>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("password_reset_tokens");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Token).HasColumnName("token");
                entity.Property(e => e.ExpiresAt).HasColumnName("expires_at");
                entity.Property(e => e.IsUsed).HasColumnName("is_used");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.CreatedByIp).HasColumnName("created_by_ip");

                entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId);
            });

            modelBuilder.Entity<FinTech.Models.EmailVerificationToken>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("email_verification_tokens");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Token).HasColumnName("token");
                entity.Property(e => e.ExpiresAt).HasColumnName("expires_at");
                entity.Property(e => e.IsUsed).HasColumnName("is_used");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");

                entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId);
            });
#pragma warning restore 612, 618
        }
    }
}
