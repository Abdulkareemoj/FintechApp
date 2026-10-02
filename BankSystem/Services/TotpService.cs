// ============================================
// FILE: Services/TotpService.cs
// PURPOSE: RFC 6238 TOTP (SHA-1, 30s, 6 digits) + RFC 4648 Base32
// ============================================

using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace FinTech.Services
{
    public static class TotpService
    {
        public const int Digits = 6;
        public const int StepSeconds = 30;
        public const string Issuer = "FinTech";

        private const string Base32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

        /// <summary>Generate a new 160-bit Base32 secret (RFC 4238 recommendation).</summary>
        public static string GenerateSecret(int numberOfBytes = 20)
        {
            var data = new byte[numberOfBytes];
            RandomNumberGenerator.Fill(data);
            return EncodeBase32(data);
        }

        /// <summary>Compute the TOTP code for a secret at a point in time (UTC).</summary>
        public static string GenerateCode(string secret, DateTime? utcNow = null, int digits = Digits, int stepSeconds = StepSeconds)
        {
            var now = utcNow ?? DateTime.UtcNow;
            var seconds = (long)(now - DateTime.UnixEpoch).TotalSeconds;
            var counter = seconds / stepSeconds;
            return ComputeCode(secret, counter, digits);
        }

        /// <summary>
        /// Verify a code allowing ±1 time-step of drift for clock skew.
        /// </summary>
        public static bool VerifyCode(string secret, string? code, int window = 1)
        {
            if (string.IsNullOrWhiteSpace(secret) || string.IsNullOrWhiteSpace(code))
                return false;

            var submitted = code.Replace(" ", string.Empty).Trim();
            if (submitted.Length != Digits || !submitted.All(char.IsDigit))
                return false;

            var seconds = (long)(DateTime.UtcNow - DateTime.UnixEpoch).TotalSeconds;
            var counter = seconds / StepSeconds;

            for (var i = -window; i <= window; i++)
            {
                var expected = ComputeCode(secret, counter + i, Digits);
                if (CryptographicOperations.FixedTimeEquals(
                        Encoding.UTF8.GetBytes(expected),
                        Encoding.UTF8.GetBytes(submitted)))
                {
                    return true;
                }
            }

            return false;
        }

        /// <summary>otpauth:// provisioning URI for authenticator apps (manual entry).</summary>
        public static string BuildOtpauthUri(string secret, string accountName)
        {
            var issuer = Uri.EscapeDataString(Issuer);
            var account = Uri.EscapeDataString(accountName);
            return $"otpauth://totp/{issuer}:{account}?secret={secret}&issuer={issuer}&algorithm=SHA1&digits={Digits}&period={StepSeconds}";
        }

        private static string ComputeCode(string secret, long counter, int digits)
        {
            var key = DecodeBase32(secret);
            var counterBytes = BitConverter.GetBytes(counter);
            if (BitConverter.IsLittleEndian)
                Array.Reverse(counterBytes);

            byte[] hash;
            using (var hmac = new HMACSHA1(key))
            {
                hash = hmac.ComputeHash(counterBytes);
            }

            // Dynamic truncation (RFC 4226 §5.3)
            var offset = hash[hash.Length - 1] & 0x0F;
            var binary =
                ((hash[offset] & 0x7F) << 24) |
                ((hash[offset + 1] & 0xFF) << 16) |
                ((hash[offset + 2] & 0xFF) << 8) |
                (hash[offset + 3] & 0xFF);

            var modulus = (int)Math.Pow(10, digits);
            var otp = binary % modulus;
            return otp.ToString().PadLeft(digits, '0');
        }

        private static string EncodeBase32(byte[] data)
        {
            var sb = new StringBuilder((data.Length * 8 + 4) / 5);
            var buffer = 0;
            var bitsLeft = 0;

            foreach (var b in data)
            {
                buffer = (buffer << 8) | b;
                bitsLeft += 8;
                while (bitsLeft >= 5)
                {
                    sb.Append(Base32Alphabet[(buffer >> (bitsLeft - 5)) & 0x1F]);
                    bitsLeft -= 5;
                }
            }

            if (bitsLeft > 0)
            {
                sb.Append(Base32Alphabet[(buffer << (5 - bitsLeft)) & 0x1F]);
            }

            return sb.ToString();
        }

        private static byte[] DecodeBase32(string input)
        {
            var clean = input.Trim().TrimEnd('=').ToUpperInvariant();
            var output = new byte[clean.Length * 5 / 8];
            var buffer = 0;
            var bitsLeft = 0;
            var index = 0;

            foreach (var c in clean)
            {
                var val = Base32Alphabet.IndexOf(c);
                if (val < 0)
                    throw new FormatException("Invalid Base32 character");

                buffer = (buffer << 5) | val;
                bitsLeft += 5;
                if (bitsLeft >= 8)
                {
                    output[index++] = (byte)((buffer >> (bitsLeft - 8)) & 0xFF);
                    bitsLeft -= 8;
                }
            }

            if (index != output.Length)
                Array.Resize(ref output, index);

            return output;
        }
    }
}
