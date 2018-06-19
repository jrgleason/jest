/**
 * Copyright (c) 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

'use strict';

// Because of the dynamic nature of a worker communication process, all messages
// coming from any of the other processes cannot be typed. Thus, many types
// include "any" as a flow type, which is (unfortunately) correct here.

/* eslint-disable no-unclear-flowtypes */

export const CHILD_MESSAGE_INITIALIZE    = 0;
export const CHILD_MESSAGE_CALL    = 1;
export const CHILD_MESSAGE_END    = 2;

export const PARENT_MESSAGE_OK    = 0;
export const PARENT_MESSAGE_ERROR    = 1;

// Option objects.

                                   

                           
               
               
                    
                           
                   
                     
               
               
  

                           
                                                        
                                          
                            
                      
                      
  

                              
                           
                     
                   
                     
   

// Messages passed from the parent to the children.

                                      
                                          
                       
                 
  

                                
                                    
                       
                   
                              
  

                               
                                   
                       
  

                          
                          
                    
                    

// Messages passed from the children to the parent.

                               
                                   
                
  

                                  
                                      
                        
                    
                  
               
  

                                                                 

// Queue types.

                                            
                                                  

                                  
                        
                                 
                             
                           
   
