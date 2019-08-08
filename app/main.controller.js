(function () {
    'use strict';
    angular.module('app').controller('MainController', constructor);

    constructor.$inject = ["$q", "mongoService"];

    function constructor($q, mongoService) {
        var vm = this;
        vm.workflowList;
        // vm.flowChartString = "";

        vm.initChart = function () {
            var diagram = flowchart.parse(vm.flowChartString);
            diagram.drawSVG('diagram');
            // diagram.drawSVG('diagram', {
            //     'x': 0,
            //     'y': 0,
            //     'line-width': 3,
            //     'line-length': 50,
            //     'text-margin': 10,
            //     'font-size': 14,
            //     'font-color': 'black',
            //     'line-color': 'black',
            //     'element-color': 'black',
            //     'fill': 'white',
            //     'yes-text': 'yes',
            //     'no-text': 'no',
            //     'arrow-end': 'block',
            //     'scale': 1,
            //     // style symbol types
            //     'symbols': {
            //         'start': {
            //             'font-color': 'red',
            //             'element-color': 'green',
            //             'fill': 'yellow'
            //         },
            //         'end': {
            //             'class': 'end-element'
            //         }
            //     },
            //     // even flowstate support ;-)
            //     'flowstate': {
            //         'past': { 'fill': '#CCCCCC', 'font-size': 12 },
            //         'current': { 'fill': 'yellow', 'font-color': 'red', 'font-weight': 'bold' },
            //         'future': { 'fill': '#FFFF99' },
            //         'request': { 'fill': 'blue' },
            //         'invalid': { 'fill': '#444444' },
            //         'approved': { 'fill': '#58C4A3', 'font-size': 12, 'yes-text': 'APPROVED', 'no-text': 'n/a' },
            //         'rejected': { 'fill': '#C45879', 'font-size': 12, 'yes-text': 'n/a', 'no-text': 'REJECTED' }
            //     }
            // });
        }

        function getWorkflows() {
            var entity = "Workflows";
            var query = {};

            mongoService.get(entity, query).then(function (workflows) {
                vm.workflowList = _.sortBy(workflows, function (o) { return o.WorkFlowName; });
            })
        }

        function getPath(ActivityId) {
            if (ActivityId.Type == 'END') {
                return;
            }
            else {
                childs = getChilds(ActivityId);
                _.forEach(childs, function (child) {
                    addChildToGraph(child);
                    getPath(child);
                })
            }
        }

        function getChilds(item){

            
        }

        function addChildToGraph(item){

        }

        function getActivities() {
            var entity = "Activitys";
            var query = {
                WorkflowId: vm.selectedWorkflow
            }
            var activityIds = [];
            mongoService.get(entity, query).then(function (activities) {
                vm.activityList = activities;
                _.forEach(vm.activityList, function (activity) {
                    activityIds.push(activity.ActivityName);
                });
                vm.startActivity = _.find(vm.activityList, { ActivityType: "Start" });
                vm.endActivity = _.find(vm.activityList, { ActivityType: "End" });

                vm.flowChartString = `st=>start: ${vm.startActivity.ActivityName}
                e=>end: ${vm.endActivity.ActivityName} 
                st->e`;
                vm.initChart();
                vm.currentActivityTransition = [];
                getViewMaps(activityIds).then(function (activityView) {
                    vm.activityViews = activityView;
                });
                getActivityTransitions().then(function (activityTransitions) {
                    vm.activityTransitions = activityTransitions;
                    _.find(vm.activityTransitions, function (transitions) {
                        if (transitions.FromActivityId === vm.startActivity.ActivityName) {
                            vm.currentActivityTransition.push(transitions)
                        }
                    });
                    console.log(vm.currentActivityTransition);
                });
            })
        }

        function getViewMaps(ids) {
            var entity = "ActivityViewMaps";
            var query = {
                ActivityId: { $in: ids }
            }
            return mongoService.get(entity, query)
        }

        function getActivityTransitions() {
            var entity = "ActivityTransitions";
            var query = {
                WorkflowId: vm.selectedWorkflow
            }
            return mongoService.get(entity, query);
        }

        vm.getWorkflowDatas = function () {
            getActivities();
        }

        function Init() {
            getWorkflows();
        }

        Init();
    }
})()