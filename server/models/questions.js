const questions = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: ["Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]"],
    constraints: ["2 <= nums.length <= 10^4", "Only one valid answer exists."],
    starterCode: `function twoSum(nums, target) {\n  // your code here\n}\n`,
    testCases: [
      { call: "twoSum([2,7,11,15], 9)", expected: "[0,1]" },
      { call: "twoSum([3,2,4], 6)", expected: "[1,2]" },
    ],
  },
  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: ["Input: s = \"abcabcbb\"\nOutput: 3"],
    constraints: ["0 <= s.length <= 5 * 10^4"],
    starterCode: `function lengthOfLongestSubstring(s) {\n  // your code here\n}\n`,
    testCases: [
      { call: 'lengthOfLongestSubstring("abcabcbb")', expected: "3" },
      { call: 'lengthOfLongestSubstring("bbbbb")', expected: "1" },
    ],
  },
  {
    id: "binary-tree",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
    examples: ["Input: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]"],
    constraints: ["The number of nodes is in the range [0, 2000]."],
    starterCode: `function levelOrder(root) {\n  // your code here\n}\n`,
    testCases: [], // tree-shaped inputs need a shared builder helper — skipping for now, not a blocker
  },
];

function getAllQuestions() {
  return questions.map(({ id, title, difficulty }) => ({ id, title, difficulty }));
}

function getQuestionById(id) {
  return questions.find((q) => q.id === id);
}

module.exports = { getAllQuestions, getQuestionById };