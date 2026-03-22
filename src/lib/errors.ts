export class ThemeGenerationError extends Error {
  constructor(
    message: string,
    public readonly step: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ThemeGenerationError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: string[]
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class BlockNotAllowedError extends ValidationError {
  constructor(public readonly blockNames: string[]) {
    super(
      `Disallowed blocks found: ${blockNames.join(', ')}`,
      blockNames.map((b) => `Block "${b}" is not in the allowlist`)
    );
    this.name = 'BlockNotAllowedError';
  }
}
