//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract Whitelist {
    // max number of whitelisted address allowed;
    uint8 public maxWhitelistedAddresses;

    // now we need to create mapping of whitellistaddress
    // if address whitelisted will set id to true otherwise false for default

    mapping (address=>bool)public WhitelistedAddresses;
    // numAddressesWhitelisted would be used to keep track of how many addresses have been whitelisted

    // variable name should match as it will be oart od varification

    uint8 public numAddressesWhitelisted;
    // we need to set max number of whitelisted adderess
    // user will put value at the time of deployment

    constructor(uint8 _maxWhitelistedAddresses){
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }
    // addAddressToWhitelist - this function adds the address of the address of the sender to the whitelist

    function addAddressToWhitelist() public{
        // we need  to check if user is alredy varified ot not
        require(!WhitelistedAddresses[msg.sender],"Sender has nbeen already varified");
        // check if the numAddressesWhitelisted < _maxWhitelistedAddresses if not then thorw error

        require(numAddressesWhitelisted <maxWhitelistedAddresses," More addresses cant be added , limit reached");
        // now we can add address whivh called the function to the whitelistd address array

        WhitelistedAddresses[msg.sender] = true;
        // increseas the number of whitelisted address
        numAddressesWhitelisted += 1;
        


    }

     


    

}