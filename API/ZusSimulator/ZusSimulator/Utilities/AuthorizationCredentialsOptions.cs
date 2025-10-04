namespace ZusSimulator.Utilities
{
    public class AuthorizationCredentialsOptions
    {
        public const string SectionName = "AuthorizationOptions";
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
