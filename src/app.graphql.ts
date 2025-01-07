export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  DateTime: { input: unknown; output: unknown }
  JSON: { input: unknown; output: unknown }
}

export type ChallengeDetails = {
  __typename?: "ChallengeDetails"
  description: Maybe<Scalars["String"]["output"]>
  id: Scalars["String"]["output"]
}

export type Challenger = {
  __typename?: "Challenger"
  id: Scalars["String"]["output"]
  name: Scalars["String"]["output"]
}

export type ChallengerInput = {
  id: Scalars["String"]["input"]
  name: Scalars["String"]["input"]
}

export type ChallengerLogin = {
  __typename?: "ChallengerLogin"
  challenger: Challenger
  token: Maybe<Scalars["String"]["output"]>
}

export type CreateChallenge = {
  id: Scalars["String"]["input"]
}

export type LoginChallenger = {
  name: Scalars["String"]["input"]
  password: Scalars["String"]["input"]
}

export type Mutation = {
  __typename?: "Mutation"
  createChallenge: Scalars["JSON"]["output"]
  deleteChallenge: Scalars["JSON"]["output"]
  loginChallenger: ChallengerLogin
  reloadCollection: Scalars["JSON"]["output"]
  resetChallenge: Scalars["JSON"]["output"]
  resetChallengeSpace: Scalars["JSON"]["output"]
}

export type MutationCreateChallengeArgs = {
  challenge: CreateChallenge
}

export type MutationDeleteChallengeArgs = {
  challenge: CreateChallenge
}

export type MutationLoginChallengerArgs = {
  challenger: LoginChallenger
}

export type Query = {
  __typename?: "Query"
  challengeSpace: Scalars["JSON"]["output"]
  challenger: Challenger
  challengesCollection: Array<ChallengeDetails>
  me: Challenger
}

export type QueryChallengerArgs = {
  id: Scalars["String"]["input"]
}
