#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype};

#[contracttype]
pub struct Voter {
    pub is_citzen: bool,
    pub registered: bool,
    pub age: u32,
}

impl Voter {
pub fn new() -> Self {
Self {is_citzen: true,registered: true, age: 17,}
    }
}

#[contract]
struct Contract {}

#[contractimpl]
impl Contract {
    pub fn get_voter_data() -> Voter {
        Voter::new() 
    }
}
