export interface CreateTcposTableDto {
  label: string;
  credentials: Omit<TcposCredentials, 'shopId'>;
}

export interface TcposCredentials {
  username: string;
  password: string;
}