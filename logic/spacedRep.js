'use strict';
class _node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertAfter(item, key) {
    if (this.head.value === key) {
      let node = new _node(item, this.head.next);
      this.head.next = node;
      return true;
    }

    let currNode = this.head;

    while (currNode.value !== key && currNode.value !== null) {
      currNode = currNode.next;
    }
    if (currNode.value === key) {
      currNode.next = new _node(item, currNode.next);
      return true;
    }
    return false;
  }

  insertAt(index, item) {
    if (index === 0) {
      this.insertFirst(item);
    }
    let currNode = this.head;
    let count = 0;
    while (count < index) {
      count++;
      if (count === index) {
        currNode.next = new _node(item, currNode.next);
      }
      else {
        currNode = currNode.next;
      }
    }
  }

  insertBefore(item, key) {
    if (this.head.value === key) {
      this.insertFirst(item);
      return true;
    }
    let currNode = this.head;
    let previousNode = this.head;
    while (currNode.next !== null && currNode.value !== key) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    if (currNode.value === key) {
      previousNode.next = new _node(item, currNode);
      return true;
    }
    return false;
  }

  insertFirst(item) {
    this.head = new _node(item, this.head);
  }

  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    }
    else {
      let tempNode = this.head;
      while(tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next =  new _node(item, null);
    }
  }

  find(item) {
    let currNode = this.head;

    if(!this.head) {
      return null;
    }

    while(currNode.value !== item) {
      if(currNode.next === null) {
        return null;
      }
      else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }

  remove(item) {
    if (!this.head) {
      return null;
    }

    if(this.head.value === item) {
      this.head = this.head.next;
      return;
    }

    let currNode = this.head;

    let previousNode = this.head;

    while ((currNode !== null) && (currNode.value !== item)) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    if(currNode === null) {
      console.log('Item not found');
      return;
    }
    previousNode.next = currNode.next;
  }
}

module.exports = LinkedList;