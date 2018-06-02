'use strict';
class _Node {
  constructor(value, next) {
      this.value=value,
      this.next=next;
  }
}

class LinkedList {
  constructor() {
      this.head = null;
  }

  insertFirst(item){
      this.head = new _Node(item, this.head);
  }

  insertLast(item){
      if(this.head === null){
          this.insertFirst(item);
      }
      else{
          let tempNode = this.head;
          while(tempNode.next !== null){
              tempNode = tempNode.next;
          }
          tempNode.next = new _Node(item, null);
      }
  }
  /**Inserts a new node after a node containing the key.*/
  insertAfter(key, itemToInsert){
      let tempNode = this.head;
      while(tempNode !== null && tempNode.value !== key){
          tempNode = tempNode.next;
      } 
      if(tempNode !== null){
          tempNode.next = new _Node(itemToInsert, tempNode.next);
      }  
  }
  /* Inserts a new node before a node containing the key.*/
  insertBefore(key, itemToInsert){
      if(this.head == null){
          return;
      }
      if(this.head.value == key){
          this.insertFirst(itemToInsert);
          return;
      }
      let prevNode = null;
      let currNode = this.head;
      while(currNode !== null && currNode.value !== key){
          prevNode = currNode;
          currNode = currNode.next;
      }
      if(currNode === null){
          console.log('Node not found to insert');
          return;
      }
      //insert between current and previous
      prevNode.next = new _Node(itemToInsert, currNode);
  }
  insertAt(nthPosition, itemToInsert) {
      if (nthPosition < 0) {
          throw new Error('Position error');
      }
      if (nthPosition === 0) {
          this.insertFirst(itemToInsert);
      }else {
          // Find the node which we want to insert after
          const node = this._findNthElement(nthPosition - 1);
          const newNode = new _Node(itemToInsert, null);
          newNode.next = node.next; 
          node.next = newNode;
      }
  }
  _findNthElement(position) {
      let node = this.head;
      for (let i=0; i<position; i++) {
          node = node.next;
      }
      return node;
  }
  remove(item){ 
      //if the list is empty
      if (!this.head){
          return null;
      }
      //if the node to be removed is head, make the next node head
      if(this.head === item){
          this.head = this.head.next;
          return;
      }
      //start at the head
      let currNode = this.head;
      //keep track of previous
      let previousNode = this.head;
      while ((currNode !== null) && (currNode.value !== item)) {
          //save the previous node 
          previousNode = currNode;
          currNode = currNode.next;
      }
      if(currNode === null){
          console.log('Item not found');
          return;
      }
      previousNode.next = currNode.next;
  }
  find(item) { //get
      //start at the head
      let currNode = this.head;
      //if the list is empty
      if (!this.head){
          return null;
      }
      while(currNode.value !== item) {
          //return null if end of the list 
          // and the item is not on the list
          if (currNode.next === null) {
              return null;
          }
          else {
              //keep looking 
              currNode = currNode.next;
          }
      }
      //found it
      return currNode;
  }
  swapHeadWithTail() {
    let nextInLine = this.head.next;
    this.insertLast(this.head.value);
    this.head = nextInLine;
  }
}

function displayList(list){
  let currNode = list.head;
  while (currNode !== null) {
      console.log(currNode.value);
      currNode = currNode.next;
  }
}

function size(lst){
  let counter = 0;
  let currNode = lst.head;
  if(!currNode){
      return counter;
  }
  else
      counter++;
  while (!(currNode.next == null)) {
      counter++;
      currNode = currNode.next;
  }
  return counter;
}

function isEmpty(lst){
  let currNode = lst.head;
  if(!currNode){
      return true;
  }
  else {
      return false;
  }
}

function findPrevious(lst, item) {
  let currNode = lst.head;
  while ((currNode !== null) && (currNode.next.value !== item)) {
      currNode = currNode.next;
  }
  return currNode;
}

function findLast(lst){
  if(lst.head === null){
      return 'list is empty';
  } 
  let tempNode = lst.head;
  while(tempNode.next !== null){
      tempNode = tempNode.next;
  }
    return tempNode;
}

/* +++++++++++++++++++++++++++++++++++++++++++++++

Mystery program
Analyze the following function (without running it in an IDE) to determine 
what problem it is trying to solve. What is the runtime of this algorithm?

function WhatDoesThisProgramDo(lst){
  let current = lst.head;
  while(current !== null){
      let newNode = current;
      while (newNode.next !== null) {
          if (newNode.next.value === current.value) {
              newNode.next = newNode.next.next;
          }
          else{
              newNode = newNode.next;
          }
      }
      current = current.next;
  }
}

//Answer: This program removes duplicates from a linked list. It will remove the 2nd and 
//later occurances of the linked list - will not presenve the order of the list

*/


/*

Reverse a list
Write an algorithm to reverse a linked list. The runtime complexity of your algorithm 
should be linear O(n). For this exercise, notice, we are not asking you just to 
print the linked list in reverse or use another linked list to store the value 
in reverse order. Your program should reverse the direction of a given 
singly-linked list. In other words, all pointers should point backward. 
BONUS: Solve this problem using recursive algorithm (and vice versa).

*/

/*
* Write an algorithm to reverse a linked list
*/
/************** A recursive version of the reverseList *********/
//O(n)
//send the head of the list - if you follow the next pointer of the head,
//you get to see the whole list. You don't have to send the whole list
/*
function  reverseList(node) {
      //what if 0 node in list
      if (node == null) {
          return null;
      }
      //what if 1 node in list
      if (node.next == null) {
          return node;
      }
      //reverse recursively and link second.next to first 
      const secondElem = node.next;
      node.next = null;
      const reverseRest = reverseList(secondElem);
      secondElem.next = node;
      return reverseRest;
}*/
function  reverseList(node) {
      //let node = list.head;
      //what if 0 node in list
      if (node === null) {
          return null;
      }
      //what if 1 node in list
      if (node.next === null) {
          return node;
      }
      //reverse recursively and link second.next to first 
      const secondElem = node.next;
      node.next = null;
      const reverseRest = reverseList(secondElem);
      secondElem.next = node;
      return reverseRest;
}
//**************** NON RECURSIVE SOLUTION ***********
function reverse(lst) {
// slowly create the list by adding to reversedPart
let reversedPart = null;
let current = lst.head;

while(current !== null) {
  // assign the next node to savedNode for safe keeping
  let savedNode = current.next;
  // Reassigns current's pointer to the new list we are making
  // reversedPart starts as null, but slowly grows as things are
  // pushed onto the new list
  current.next = reversedPart;
  reversedPart = current;
  // update the counter that is traveling through the array
  current = savedNode;
}
// update the head so we have access to the linked list
lst.head = reversedPart;
//displayList(lst);
return lst;
};

/*
Third from the end
Write an algorithm to find the third element from the end of a linked list. 
Note You may be tempted to add a length property to your Linked List class. 
The length property is not a typical property of linked list, therefore don't make 
any modification to the Linked list class that is provided to you.

*/

// O(n) complexity
function thirdFromEnd(lst) {
let thirdEnd = lst.head;
let end = lst.head.next.next.next;
while(end !== null) {
  thirdEnd = thirdEnd.next;
  end = end.next;
}
return thirdEnd.value;
};

/*
Middle of a list
Write an algorithm to find the middle element of a linked list. 
Note You may be tempted to add a length property to your Linked List class. 
The length property is not a typical property of linked list, therefore don't make 
any modification to the Linked list class that is provided to you. Also, finding 
the size of the linked list using the size() function and dividing it by half will 
not find the correct middle of the linked list. So, don't use either of these approaches.

*/

function middleOfList(lst) {
let end = lst.head;
let middle = lst.head;
// two cases cover even and odd length
while(end !== null && end.next !== null) {
  // advance one pointer 2 times faster than the other
  end = end.next.next;
  middle = middle.next;
}
// return the value of the node which was advanced at regular speed
return middle.value;
};

/*
Cycle in a list
Write an algorithm to find whether a linked list has a cycle 
(i.e. whether a node in the list has its next value pointing to an earlier 
node in the list). For this exercise, create a Linked list called CycleList. 
Be sure to insert nodes in the list so that it has a cycle. Then test your program 
with your cycleList.

*/

// each time the method is called it flags
// seen nodes with a new value
function hasCycle (lst) {
// has a high probability of preventing false positives
var flag = Math.random();
var current = lst.head; //1 2 3 4
while(current !== null) {
  if(current.value === flag) {
    return true;
  }
  current.value = flag;
  current = current.next;
}
return false;
}
// A fast way to find a cycle is to have 2 pointers
//one moving 2 steps ahead and another moving 1 step ahead
//the the 2 ever meets, we have a cycle

function findCycle(lst){
   let fast = lst.head;
   let slow = lst.head;
// two cases cover even and odd length
  while(slow !== null && fast !== null && fast.next !== null) {
  // advance one pointer 2 times faster than the other
      slow = slow.next;
      fast = fast.next.next;
      if (slow === fast) {
          console.log("Found CYCLE!!!!");
          return;
      }
  }
  console.log("NO Cycle Found");
}


function main(){

  let sll = new LinkedList();
  sll.insertLast('Apollo');
  sll.insertLast('Boomer');
  sll.insertLast('Helo');
  sll.insertLast('Husker');
  sll.insertLast('Starbuck');

/*
* Add `Tauhida` to the list
* Remove `squirrel` from the list
* Implement a function called `insertBefore()` in the class that inserts a new node before a given node containing a key
* Implement a function called `insertAfter()` in the class that inserts a new node after a node containing the key
* Implement a function called `insertAt()` that inserts an item at a specific position in the linked list
* Add `Athena` before `Boomer` using your insertBefore() function
* Add `Hotdog` after `Helo` using the insertAfter() method
* Using the `insertAt()` method insert `Kat` in the 3rd position of the list
* Remove `Tauhida` from the list
*/
  //* Add `Tauhida` to the list
  sll.insertLast('Tauhida');

  //* Remove `squirrel` from the list
  sll.remove('Squirrel');

  //* Add `Athena` before `Boomer` using your insertBefore() function
  sll.insertBefore('Boomer','Athena');

  //* Add `Hotdog` after `Helo` using the insertAfter() method
  sll.insertAfter('Helo','Hot dog');

  //Flattop after boomer
  sll.insertAfter('Boomer','Flat top')
  
  //* Using the `insertAt()` method insert `Kat` in the 3rd position of the list
  sll.insertAt(3,'Kat');

  //* Remove `Tauhida` from the list
  sll.remove('Tauhida');
  
/*
display: displays the linked list.
size: returns the size of the linked list.
isEmpty: finds if the list is empty or not (without using the size() function)
findPrevious: finds the node before the item you are looking for
findLast: returns the last node in the linked list
*/
  //display: displays the linked list.
  displayList(sll);

  //size: returns the size of the linked list.
  //console.log(size(sll));
  
  //isEmpty: finds if the list is empty or not (without using the size() function)
  //console.log(isEmpty(sll));

  //findPrevious: finds the node before the item you are looking for
  let prevNode = findPrevious(sll, 'Kat');
  //console.log(prevNode.value);

  //findLast: returns the last node in the linked list
  let lastNode = findLast(sll);
  //console.log(lastNode.value);

  //reverse a List
  //console.log(reverseList(sll.head));
  //displayList(reverse(sll));

  //thirdFromEnd
  //console.log(thirdFromEnd(sll));

  //middle of List
  //console.log(middleOfList(sll));

  //cycle in a list
  //Create a cycle in the list
  findCycle(sll);
  console.log(hasCycle(sll));

  sll.head.next.next = sll.head;
  findCycle(sll);
  console.log(hasCycle(sll));

}

module.exports = {LinkedList, size};